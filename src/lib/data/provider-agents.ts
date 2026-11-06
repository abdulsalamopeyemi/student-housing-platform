import "server-only";

import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";
import type { ProviderProperty } from "@/lib/data/provider-properties";

export interface VerifiedAgent {
  id: string;
  display_name: string | null;
  verification_status: "verified";
}

export interface PropertyAgentAssignment {
  property_id: string;
  agent_provider_id: string;
  created_at: string;
  providers: {
    id: string;
    display_name: string | null;
    verification_status: "verified";
  } | null;
}

export async function getVerifiedAgents() {
  return supabaseAuthenticatedRest<VerifiedAgent[]>(
    "providers?provider_type=eq.agent&verification_status=eq.verified&select=id,display_name,verification_status&order=display_name.asc",
  );
}

export async function getVisibleAgentAssignments() {
  return supabaseAuthenticatedRest<PropertyAgentAssignment[]>(
    "property_agent_assignments?select=property_id,agent_provider_id,created_at,providers!property_agent_assignments_agent_provider_id_fkey(id,display_name,verification_status)&order=created_at.desc",
  );
}

export async function getAssignedAgentProperties(agentProviderId: string) {
  const assignments = await supabaseAuthenticatedRest<
    Array<{ property_id: string }>
  >(
    `property_agent_assignments?agent_provider_id=eq.${encodeURIComponent(
      agentProviderId,
    )}&select=property_id`,
  );

  if (assignments.length === 0) {
    return [];
  }

  const ids = assignments.map((item) => item.property_id).join(",");

  return supabaseAuthenticatedRest<ProviderProperty[]>(
    `properties?id=in.(${ids})&select=id,name,slug,area,distance_label,publication_status,verification_status,updated_at,universities(name),room_types(id,name,total_count,available_count,annual_rent,availability_updated_at)&order=updated_at.desc`,
  );
}
