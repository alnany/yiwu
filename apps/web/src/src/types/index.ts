export type UserRole = "manufacturer" | "designer" | "admin";
export type UserStatus = "pending" | "active" | "suspended" | "rejected";
export type AuditStatus = "pending" | "scheduled" | "completed" | "failed";
export type AuditResult = "pass" | "fail" | "conditional";
export type RfpStatus = "open" | "closed" | "fulfilled";
export type ResponseStatus = "pending" | "shortlisted" | "rejected";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface ManufacturerProfile {
  id: string;
  user_id: string;
  company_name: string;
  description?: string;
  country: string;
  city?: string;
  website?: string;
  tags: string[];
  is_verified: boolean;
  verified_at?: string;
  avatar_url?: string;
  cover_url?: string;
}

export interface DesignerProfile {
  id: string;
  user_id: string;
  full_name: string;
  company?: string;
  country: string;
  specialties: string[];
  portfolio_url?: string;
  avatar_url?: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  media_urls: string[];
  tags: string[];
  lang: string;
  like_count: number;
  comment_count: number;
  created_at: string;
  author?: ManufacturerProfile | DesignerProfile;
  author_role?: UserRole;
  is_liked?: boolean;
  is_following?: boolean;
}

export interface RfpPost {
  id: string;
  designer_id: string;
  title: string;
  description: string;
  product_categories: string[];
  budget_range?: string;
  timeline?: string;
  target_region?: string;
  status: RfpStatus;
  created_at: string;
  designer?: DesignerProfile;
  response_count?: number;
}

export interface RfpResponse {
  id: string;
  rfp_id: string;
  manufacturer_id: string;
  message: string;
  status: ResponseStatus;
  created_at: string;
  manufacturer?: ManufacturerProfile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  content_translated?: { en?: string; zh?: string; es?: string; it?: string };
  media_urls: string[];
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant_ids: string[];
  last_message?: Message;
  unread_count?: number;
  participants?: (ManufacturerProfile | DesignerProfile)[];
}

export interface Audit {
  id: string;
  manufacturer_id: string;
  auditor_id?: string;
  status: AuditStatus;
  scheduled_at?: string;
  completed_at?: string;
  checklist?: Record<string, boolean>;
  notes?: string;
  result?: AuditResult;
  manufacturer?: ManufacturerProfile;
}
