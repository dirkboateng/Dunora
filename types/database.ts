/**
 * Database types for Dunora's Supabase schema.
 *
 * Hand-maintained until the Supabase project is provisioned. Then regenerate:
 *   npm run types:supabase
 *
 * Once generated, treat as an artifact — don't edit by hand.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Enums ───────────────────────────────────────────────────────────────────
export type PhotoStatus =
  | "queued" | "uploading" | "uploaded"
  | "processing" | "processed" | "failed" | "archived";

export type ProjectStatus =
  | "draft" | "uploading" | "processing"
  | "ready" | "published" | "archived";

export type GalleryVisibility = "private" | "password" | "public";
export type MemberRole = "owner" | "admin" | "editor" | "viewer";
export type JobType =
  | "thumbnail" | "preview" | "watermark" | "enhance" | "zip_export";
export type JobStatus = "queued" | "running" | "done" | "failed";
export type AccountType =
  | "photographer" | "club" | "agency" | "event" | "other";

// ─── Helper type aliases ─────────────────────────────────────────────────────
type Timestamp = string;
type UUID = string;

// ─── Database shape ──────────────────────────────────────────────────────────
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: UUID;
          full_name: string;
          avatar_url: string | null;
          account_type: AccountType | null;
          onboarding_completed_at: Timestamp | null;
          created_at: Timestamp;
        };
        Insert: {
          id: UUID;
          full_name: string;
          avatar_url?: string | null;
          account_type?: AccountType | null;
          onboarding_completed_at?: Timestamp | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      workspaces: {
        Row: {
          id: UUID;
          name: string;
          slug: string;
          logo_url: string | null;
          brand_color: string;
          watermark_default_id: UUID | null;
          owner_id: UUID;
          storage_used_bytes: number;
          storage_quota_bytes: number;
          created_at: Timestamp;
          deleted_at: Timestamp | null;
        };
        Insert: {
          name: string;
          slug: string;
          owner_id: UUID;
          logo_url?: string | null;
          brand_color?: string;
        };
        Update: Partial<Database["public"]["Tables"]["workspaces"]["Insert"]>;
      };

      workspace_members: {
        Row: {
          id: UUID;
          workspace_id: UUID;
          user_id: UUID;
          role: MemberRole;
          created_at: Timestamp;
        };
        Insert: {
          workspace_id: UUID;
          user_id: UUID;
          role?: MemberRole;
        };
        Update: Partial<Database["public"]["Tables"]["workspace_members"]["Insert"]>;
      };

      clients: {
        Row: {
          id: UUID;
          workspace_id: UUID;
          name: string;
          email: string | null;
          company: string | null;
          notes: string | null;
          created_at: Timestamp;
        };
        Insert: {
          workspace_id: UUID;
          name: string;
          email?: string | null;
          company?: string | null;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
      };

      projects: {
        Row: {
          id: UUID;
          workspace_id: UUID;
          client_id: UUID | null;
          name: string;
          slug: string;
          type: string | null;
          description: string | null;
          shoot_date: string | null;
          status: ProjectStatus;
          cover_photo_id: UUID | null;
          photo_count: number;
          created_at: Timestamp;
          updated_at: Timestamp;
          deleted_at: Timestamp | null;
        };
        Insert: {
          workspace_id: UUID;
          name: string;
          slug: string;
          client_id?: UUID | null;
          type?: string | null;
          description?: string | null;
          shoot_date?: string | null;
          status?: ProjectStatus;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };

      photos: {
        Row: {
          id: UUID;
          workspace_id: UUID;
          project_id: UUID;
          storage_path: string;
          file_name: string;
          file_size_bytes: number;
          mime_type: string;
          width: number | null;
          height: number | null;
          hash: string | null;
          status: PhotoStatus;
          metadata: Json;
          created_at: Timestamp;
          deleted_at: Timestamp | null;
        };
        Insert: {
          id?: UUID;
          workspace_id: UUID;
          project_id: UUID;
          storage_path: string;
          file_name: string;
          file_size_bytes: number;
          mime_type: string;
          width?: number | null;
          height?: number | null;
          hash?: string | null;
          status?: PhotoStatus;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["photos"]["Insert"]>;
      };

      galleries: {
        Row: {
          id: UUID;
          workspace_id: UUID;
          project_id: UUID;
          title: string;
          slug: string;
          description: string | null;
          cover_photo_id: UUID | null;
          visibility: GalleryVisibility;
          password_hash: string | null;
          allow_downloads: boolean;
          allow_originals: boolean;
          allow_search_indexing: boolean;
          theme: string;
          view_count: number;
          download_count: number;
          published_at: Timestamp | null;
          expires_at: Timestamp | null;
          created_at: Timestamp;
        };
        Insert: {
          workspace_id: UUID;
          project_id: UUID;
          title: string;
          slug: string;
          description?: string | null;
          cover_photo_id?: UUID | null;
          visibility?: GalleryVisibility;
          password_hash?: string | null;
          allow_downloads?: boolean;
          allow_originals?: boolean;
          allow_search_indexing?: boolean;
          theme?: string;
          published_at?: Timestamp | null;
          expires_at?: Timestamp | null;
        };
        Update: Partial<Database["public"]["Tables"]["galleries"]["Insert"]>;
      };

      gallery_photos: {
        Row: {
          id: UUID;
          gallery_id: UUID;
          photo_id: UUID;
          sort_order: number;
          is_hidden: boolean;
        };
        Insert: {
          gallery_id: UUID;
          photo_id: UUID;
          sort_order?: number;
          is_hidden?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_photos"]["Insert"]>;
      };

      presets: {
        Row: {
          id: UUID;
          workspace_id: UUID;
          name: string;
          category: string | null;
          description: string | null;
          settings: Json;
          preview_url: string | null;
          is_default: boolean;
          created_at: Timestamp;
        };
        Insert: {
          workspace_id: UUID;
          name: string;
          category?: string | null;
          description?: string | null;
          settings?: Json;
          preview_url?: string | null;
          is_default?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["presets"]["Insert"]>;
      };

      watermarks: {
        Row: {
          id: UUID;
          workspace_id: UUID;
          name: string;
          logo_path: string;
          position: string;
          opacity: number;
          size: string;
          size_percent: number | null;
          margin: number;
          is_default: boolean;
          created_at: Timestamp;
        };
        Insert: {
          workspace_id: UUID;
          name: string;
          logo_path: string;
          position?: string;
          opacity?: number;
          size?: string;
          size_percent?: number | null;
          margin?: number;
          is_default?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["watermarks"]["Insert"]>;
      };

      processing_jobs: {
        Row: {
          id: UUID;
          workspace_id: UUID;
          photo_id: UUID | null;
          type: JobType;
          status: JobStatus;
          progress: number;
          error_message: string | null;
          attempts: number;
          created_at: Timestamp;
          started_at: Timestamp | null;
          finished_at: Timestamp | null;
        };
        Insert: {
          workspace_id: UUID;
          photo_id?: UUID | null;
          type: JobType;
          status?: JobStatus;
        };
        Update: Partial<Database["public"]["Tables"]["processing_jobs"]["Insert"]>;
      };

      gallery_views: {
        Row: {
          id: UUID;
          gallery_id: UUID;
          visitor_hash: string;
          country: string | null;
          referrer: string | null;
          viewed_at: Timestamp;
        };
        Insert: {
          gallery_id: UUID;
          visitor_hash: string;
          country?: string | null;
          referrer?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_views"]["Insert"]>;
      };

      activity_logs: {
        Row: {
          id: UUID;
          workspace_id: UUID;
          project_id: UUID | null;
          user_id: UUID | null;
          action: string;
          metadata: Json;
          created_at: Timestamp;
        };
        Insert: {
          workspace_id: UUID;
          action: string;
          project_id?: UUID | null;
          user_id?: UUID | null;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["activity_logs"]["Insert"]>;
      };
    };

    Functions: {
      user_workspace_ids: {
        Args: Record<string, never>;
        Returns: UUID[];
      };
      ensure_workspace: {
        Args: Record<string, never>;
        Returns: {
          workspace_id: UUID;
          workspace_name: string;
          workspace_slug: string;
          storage_used_bytes: number;
          storage_quota_bytes: number;
          member_role: string;
        }[];
      };
      increment_gallery_view: {
        Args: { p_slug: string };
        Returns: void;
      };
    };

    Enums: {
      photo_status: PhotoStatus;
      project_status: ProjectStatus;
      gallery_visibility: GalleryVisibility;
      member_role: MemberRole;
      job_type: JobType;
      job_status: JobStatus;
    };
  };
};
