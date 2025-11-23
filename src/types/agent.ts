/**
 * انواع مربوط به مشاور
 */

import { User } from "./user";

export interface Agent extends User {
  type: "agent" | "admin";
  company: string;
  licenseNumber: string;
  verified: boolean;
  rating?: number;
  totalProperties?: number;
  soldProperties?: number;
}

export interface AgentStats {
  activeProperties: number;
  totalViews: number;
  totalFavorites: number;
  totalMessages: number;
  soldThisMonth: number;
}

