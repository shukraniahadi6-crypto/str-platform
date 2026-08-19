import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

abstract class BaseEntityColumns {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;
}

@Entity("users")
export class User extends BaseEntityColumns {
  @Column({ unique: true }) email!: string;
  @Column({ unique: true }) phone!: string;
  @Column() password_hash!: string;
  @Column({ default: "LOCAL" }) auth_provider!: string;
  @Column({ default: "VENDOR" }) role!: string;
}

@Entity("user_profiles")
export class UserProfile extends BaseEntityColumns {
  @Column("uuid") user_id!: string;
  @Column({ type: "jsonb", default: {} }) vendor_metadata!: Record<string, unknown>;
  @Column({ type: "jsonb", default: {} }) courier_metadata!: Record<string, unknown>;
  @Column({ type: "jsonb", default: {} }) preferences!: Record<string, unknown>;
}

@Entity("driver_verifications")
export class DriverVerification extends BaseEntityColumns {
  @Column("uuid") courier_id!: string;
  @Column() license_number!: string;
  @Column({ type: "date" }) license_expiry!: string;
  @Column({ nullable: true }) insurance_policy!: string | null;
  @Column({ default: "PENDING" }) background_check_status!: string;
  @Column({ type: "timestamptz", nullable: true }) verified_at!: Date | null;
}

@Entity("device_tokens")
export class DeviceToken extends BaseEntityColumns {
  @Column("uuid") user_id!: string;
  @Column({ unique: true }) device_token!: string;
  @Column() platform!: string;
}

@Entity("jobs")
export class Job extends BaseEntityColumns {
  @Column("uuid") vendor_id!: string;
  @Column("uuid", { nullable: true }) courier_id!: string | null;
  @Column() address!: string;
  @Column({ type: "jsonb", default: [] }) items_json!: unknown[];
  @Column("numeric") estimated_volume!: number;
  @Column({ default: "DRAFT" }) status!: string;
  @Column({ type: "timestamptz", nullable: true }) scheduled_at!: Date | null;
}

@Entity("job_photos")
export class JobPhoto extends BaseEntityColumns {
  @Column("uuid") job_id!: string;
  @Column() url!: string;
  @Column() photo_type!: string;
  @Column({ type: "timestamptz", default: () => "NOW()" }) uploaded_at!: Date;
}

@Entity("job_locations")
export class JobLocation extends BaseEntityColumns {
  @Column("uuid") job_id!: string;
  @Column({ type: "double precision", nullable: true }) latitude!: number | null;
  @Column({ type: "double precision", nullable: true }) longitude!: number | null;
  @Column({ type: "jsonb", default: {} }) address_components!: Record<string, unknown>;
  @Column({ type: "geometry", spatialFeatureType: "Point", srid: 4326, nullable: true }) geom!: unknown;
}

@Entity("courier_locations")
export class CourierLocation extends BaseEntityColumns {
  @Column("uuid") courier_id!: string;
  @Column({ type: "double precision", nullable: true }) latitude!: number | null;
  @Column({ type: "double precision", nullable: true }) longitude!: number | null;
  @Column({ type: "timestamptz", default: () => "NOW()" }) last_updated_at!: Date;
  @Column({ type: "numeric", nullable: true }) bearing!: number | null;
  @Column({ type: "numeric", nullable: true }) speed!: number | null;
  @Column({ type: "geometry", spatialFeatureType: "Point", srid: 4326, nullable: true }) geom!: unknown;
}

@Entity("transfer_stations")
export class TransferStation extends BaseEntityColumns {
  @Column() name!: string;
  @Column({ type: "double precision", nullable: true }) latitude!: number | null;
  @Column({ type: "double precision", nullable: true }) longitude!: number | null;
  @Column("integer") capacity!: number;
  @Column({ type: "jsonb", default: {} }) hours_json!: Record<string, unknown>;
  @Column("text", { array: true, default: [] }) waste_classes_accepted!: string[];
  @Column({ type: "geometry", spatialFeatureType: "Point", srid: 4326, nullable: true }) geom!: unknown;
}

@Entity("donation_partners")
export class DonationPartner extends BaseEntityColumns {
  @Column() name!: string;
  @Column({ type: "double precision", nullable: true }) latitude!: number | null;
  @Column({ type: "double precision", nullable: true }) longitude!: number | null;
  @Column("text", { array: true, default: [] }) upcyclable_categories!: string[];
  @Column({ type: "jsonb", default: {} }) contact_info!: Record<string, unknown>;
  @Column({ type: "geometry", spatialFeatureType: "Point", srid: 4326, nullable: true }) geom!: unknown;
}

@Entity("offer_pings")
export class OfferPing extends BaseEntityColumns {
  @Column("uuid") job_id!: string;
  @Column("uuid") courier_id!: string;
  @Column("numeric") upfront_pay!: number;
  @Column("numeric") estimated_distance!: number;
  @Column({ type: "timestamptz" }) expires_at!: Date;
  @Column({ default: "PENDING" }) status!: string;
}

@Entity("batches")
export class Batch extends BaseEntityColumns {
  @Column("uuid") courier_id!: string;
  @Column("uuid", { array: true, default: [] }) job_ids!: string[];
  @Column("numeric", { default: 0 }) batch_discount_pct!: number;
  @Column({ type: "timestamptz", nullable: true }) completed_at!: Date | null;
  @Column({ type: "jsonb", default: [] }) route_sequence!: unknown[];
}

@Entity("neighborhood_groups")
export class NeighborhoodGroup extends BaseEntityColumns {
  @Column({ type: "jsonb", default: [] }) polygon_coordinates!: unknown[];
  @Column("numeric", { default: 0 }) discount_rate!: number;
  @Column("numeric") alert_radius_m!: number;
  @Column() city!: string;
  @Column({ default: "ACTIVE" }) status!: string;
  @Column({ type: "geometry", spatialFeatureType: "Polygon", srid: 4326, nullable: true }) geom!: unknown;
}

@Entity("upcyclable_items")
export class UpcyclableItem extends BaseEntityColumns {
  @Column("uuid") job_id!: string;
  @Column() item_description!: string;
  @Column() category!: string;
  @Column("uuid", { nullable: true }) donation_partner_id!: string | null;
  @Column({ default: false }) is_donated!: boolean;
  @Column({ type: "timestamptz", nullable: true }) donated_at!: Date | null;
}

@Entity("green_impact_metrics")
export class GreenImpactMetric extends BaseEntityColumns {
  @Column("uuid") job_id!: string;
  @Column("numeric") landfill_diversion_pct!: number;
  @Column("numeric") co2_saved_kg!: number;
  @Column("numeric") trees_equivalent!: number;
}

@Entity("green_impact_receipts")
export class GreenImpactReceipt extends BaseEntityColumns {
  @Column("uuid") job_id!: string;
  @Column("uuid") vendor_id!: string;
  @Column({ type: "jsonb" }) impact_card_json!: Record<string, unknown>;
  @Column({ nullable: true }) social_share_url!: string | null;
}

@Entity("vendor_accounts")
export class VendorAccount extends BaseEntityColumns {
  @Column("uuid") user_id!: string;
  @Column("numeric", { default: 0 }) balance!: number;
  @Column("numeric", { default: 0 }) total_charged!: number;
  @Column({ default: "USD" }) currency!: string;
}

@Entity("courier_accounts")
export class CourierAccount extends BaseEntityColumns {
  @Column("uuid") user_id!: string;
  @Column("numeric", { default: 0 }) balance!: number;
  @Column("numeric", { default: 0 }) total_earned!: number;
  @Column("numeric", { default: 0 }) tips_earned!: number;
  @Column("numeric", { default: 0 }) upcycle_bonus_earned!: number;
  @Column({ default: false }) instant_cashout_enabled!: boolean;
}

@Entity("ledger_entries")
export class LedgerEntry extends BaseEntityColumns {
  @Column("uuid") account_id!: string;
  @Column("numeric", { default: 0 }) debit_amount!: number;
  @Column("numeric", { default: 0 }) credit_amount!: number;
  @Column() transaction_type!: string;
  @Column("uuid", { nullable: true }) job_id!: string | null;
  @Column("uuid", { nullable: true }) reference_id!: string | null;
}

@Entity("payments")
export class Payment extends BaseEntityColumns {
  @Column("uuid") vendor_id!: string;
  @Column({ nullable: true, unique: true }) stripe_charge_id!: string | null;
  @Column("numeric") amount!: number;
  @Column({ default: "PENDING" }) status!: string;
  @Column({ type: "jsonb", default: {} }) metadata_json!: Record<string, unknown>;
}

@Entity("payouts")
export class Payout extends BaseEntityColumns {
  @Column("uuid") courier_id!: string;
  @Column({ nullable: true, unique: true }) stripe_payout_id!: string | null;
  @Column("numeric") amount!: number;
  @Column({ default: "PENDING" }) status!: string;
  @Column({ type: "timestamptz", default: () => "NOW()" }) requested_at!: Date;
  @Column({ type: "timestamptz", nullable: true }) completed_at!: Date | null;
}

@Entity("sds_cases")
export class SDSCase extends BaseEntityColumns {
  @Column("uuid") job_id!: string;
  @Column("enum", { enum: ["HAZMAT", "HEAVY_ITEM", "ELECTRONICS", "CHEMICALS", "UNKNOWN"], array: true, default: ["UNKNOWN"] })
  hazard_flags!: string[];
  @Column("numeric") ai_confidence!: number;
  @Column({ default: "PENDING" }) human_review_status!: string;
  @Column({ type: "timestamptz", nullable: true }) resolved_at!: Date | null;
}

@Entity("courses")
export class Course extends BaseEntityColumns {
  @Column() title!: string;
  @Column() category!: string;
  @Column() description!: string;
  @Column({ type: "jsonb", default: [] }) quiz_questions_json!: unknown[];
  @Column({ default: "BEGINNER" }) difficulty!: string;
}

@Entity("courier_completions")
export class CourierCompletion extends BaseEntityColumns {
  @Column("uuid") courier_id!: string;
  @Column("uuid") course_id!: string;
  @Column({ type: "timestamptz", default: () => "NOW()" }) completion_date!: Date;
  @Column("numeric") score!: number;
  @Column({ default: false }) passed!: boolean;
}

@Entity("badges")
export class Badge extends BaseEntityColumns {
  @Column({ unique: true }) name!: string;
  @Column({ nullable: true }) icon_url!: string | null;
  @Column({ nullable: true }) description!: string | null;
  @Column() requirement_type!: string;
  @Column() requirement_value!: string;
}

@Entity("courier_badges")
export class CourierBadge extends BaseEntityColumns {
  @Column("uuid") courier_id!: string;
  @Column("uuid") badge_id!: string;
  @Column({ type: "timestamptz", default: () => "NOW()" }) earned_at!: Date;
}

@Entity("disputes")
export class Dispute extends BaseEntityColumns {
  @Column("uuid") job_id!: string;
  @Column("uuid") initiator_id!: string;
  @Column() reason!: string;
  @Column({ type: "jsonb", default: [] }) evidence_photos_json!: string[];
  @Column({ nullable: true }) admin_decision!: string | null;
  @Column({ type: "timestamptz", nullable: true }) resolved_at!: Date | null;
}

@Entity("notification_logs")
export class NotificationLog extends BaseEntityColumns {
  @Column("uuid") user_id!: string;
  @Column() event_type!: string;
  @Column() message!: string;
  @Column({ type: "timestamptz", nullable: true }) read_at!: Date | null;
}

@Entity("reviews")
export class Review extends BaseEntityColumns {
  @Column("uuid") job_id!: string;
  @Column("uuid") reviewer_id!: string;
  @Column("uuid") reviewee_id!: string;
  @Column("integer") rating!: number;
  @Column({ nullable: true }) comment!: string | null;
}

@Entity("stripe_customers")
export class StripeCustomer extends BaseEntityColumns {
  @Column("uuid") user_id!: string;
  @Column({ unique: true }) stripe_customer_id!: string;
  @Column({ nullable: true }) default_payment_method_id!: string | null;
}

@Entity("stripe_connect_accounts")
export class StripeConnectAccount extends BaseEntityColumns {
  @Column("uuid") courier_id!: string;
  @Column({ unique: true }) stripe_account_id!: string;
  @Column() verification_status!: string;
}
