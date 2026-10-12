/**
 * انواع پاسخ API گویا کلاب
 * GET /api/club/
 * POST /api/club/instagram/
 */

export interface ClubStats {
  videos_completed: number;
  questions_answered: number;
  correct_answers: number;
}

export interface ClubPointsGuideItem {
  key: string;
  label: string;
  points: number;
}

export interface ClubLottery {
  eligible: boolean;
  instagram_id: string | null;
  reason: string | null;
  note: string;
  instagram_page: string;
}

export interface ClubProfile {
  full_name: string;
  phone: string;
  total_points: number;
  month_points: number;
  stats: ClubStats;
  points_guide: ClubPointsGuideItem[];
  lottery: ClubLottery;
}

export interface ClubInstagramPayload {
  instagram_id: string;
}

export interface ClubInstagramResponse {
  instagram_id: string;
  lottery: ClubLottery;
  total_points: number;
}
