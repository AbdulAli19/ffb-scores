-- CreateTable
CREATE TABLE "sleeper-players" (
    "id" TEXT NOT NULL,
    "birth_country" TEXT,
    "stats_id" TEXT,
    "search_first_name" TEXT,
    "years_exp" TEXT,
    "first_name" TEXT,
    "depth_chart_order" TEXT,
    "weight" TEXT,
    "position" TEXT,
    "birth_date" TEXT,
    "pandascore_id" TEXT,
    "gsis_id" TEXT,
    "oddsjam_id" TEXT,
    "age" TEXT,
    "metadata" TEXT,
    "full_name" TEXT,
    "height" TEXT,
    "number" TEXT,
    "injury_body_part" TEXT,
    "fantasy_positions" TEXT,
    "team" TEXT,
    "search_rank" BIGINT,
    "search_full_name" TEXT,
    "depth_chart_position" TEXT,
    "practice_participation" TEXT,
    "injury_start_date" TEXT,
    "sport" TEXT,
    "birth_city" TEXT,
    "rotoworld_id" TEXT,
    "fantasy_data_id" TEXT,
    "espn_id" TEXT,
    "status" TEXT,
    "practice_description" TEXT,
    "birth_state" TEXT,
    "sportradar_id" TEXT,
    "yahoo_id" TEXT,
    "swish_id" TEXT,
    "player_id" TEXT,
    "injury_notes" TEXT,
    "active" BOOLEAN,
    "college" TEXT,
    "last_name" TEXT,
    "search_last_name" TEXT,
    "news_updated" TEXT,
    "hashtag" TEXT,
    "high_school" TEXT,
    "rotowire_id" TEXT,
    "injury_status" TEXT,

    CONSTRAINT "sleeper-players_pkey" PRIMARY KEY ("id")
);
