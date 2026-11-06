"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentProvider } from "@/lib/data/providers";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";

function workspaceMessage(message: string) {
  return `/list-property?message=${encodeURIComponent(message)}`;
}

export async function assignAgentToProperty(formData: FormData) {
  const { user, provider } = await getCurrentProvider();

  if (!user) {
    redirect("/login?next=/list-property");
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  if (provider.provider_type === "agent") {
    redirect(workspaceMessage("Agents cannot assign other agents to properties."));
  }

  const propertyId = String(formData.get("propertyId") ?? "").trim();
  const agentProviderId = String(formData.get("agentProviderId") ?? "").trim();

  if (!propertyId || !agentProviderId) {
    redirect(workspaceMessage("Choose a verified agent before assigning."));
  }

  const ownedProperties = await supabaseAuthenticatedRest<Array<{ id: string }>>(
    `properties?id=eq.${encodeURIComponent(
      propertyId,
    )}&provider_id=eq.${encodeURIComponent(provider.id)}&select=id&limit=1`,
  );

  if (ownedProperties.length === 0) {
    redirect(workspaceMessage("You can only assign agents to properties you manage."));
  }

  const agents = await supabaseAuthenticatedRest<Array<{ id: string }>>(
    `providers?id=eq.${encodeURIComponent(
      agentProviderId,
    )}&provider_type=eq.agent&verification_status=eq.verified&select=id&limit=1`,
  );

  if (agents.length === 0) {
    redirect(workspaceMessage("That agent is not currently verified."));
  }

  try {
    const currentAssignments = await supabaseAuthenticatedRest<
      Array<{ property_id: string }>
    >(
      `property_agent_assignments?property_id=eq.${encodeURIComponent(
        propertyId,
      )}&select=property_id&limit=1`,
    );

    if (currentAssignments.length > 0) {
      await supabaseAuthenticatedRest(
        `property_agent_assignments?property_id=eq.${encodeURIComponent(
          propertyId,
        )}`,
        {
          method: "PATCH",
          prefer: "return=representation",
          body: JSON.stringify({
            agent_provider_id: agentProviderId,
            assigned_by_provider_id: provider.id,
            updated_at: new Date().toISOString(),
          }),
        },
      );
    } else {
      await supabaseAuthenticatedRest("property_agent_assignments", {
        method: "POST",
        prefer: "return=representation",
        body: JSON.stringify({
          property_id: propertyId,
          agent_provider_id: agentProviderId,
          assigned_by_provider_id: provider.id,
        }),
      });
    }
  } catch {
    redirect(workspaceMessage("We could not assign that agent. Please try again."));
  }

  revalidatePath("/list-property");
  redirect(workspaceMessage("Agent assigned to property."));
}

export async function removeAgentFromProperty(formData: FormData) {
  const { user, provider } = await getCurrentProvider();

  if (!user) {
    redirect("/login?next=/list-property");
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  if (provider.provider_type === "agent") {
    redirect(workspaceMessage("Agents cannot remove property assignments."));
  }

  const propertyId = String(formData.get("propertyId") ?? "").trim();

  if (!propertyId) {
    redirect(workspaceMessage("Property assignment could not be identified."));
  }

  try {
    await supabaseAuthenticatedRest(
      `property_agent_assignments?property_id=eq.${encodeURIComponent(
        propertyId,
      )}`,
      { method: "DELETE" },
    );
  } catch {
    redirect(workspaceMessage("We could not remove the assigned agent."));
  }

  revalidatePath("/list-property");
  redirect(workspaceMessage("Agent removed from property."));
}
