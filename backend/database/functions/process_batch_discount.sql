CREATE OR REPLACE FUNCTION process_batch_discount(target_batch_id UUID)
RETURNS INTEGER AS $$
DECLARE
  discounted_count INTEGER := 0;
  batch_record batches%ROWTYPE;
BEGIN
  SELECT * INTO batch_record FROM batches WHERE id = target_batch_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Batch % not found', target_batch_id;
  END IF;

  UPDATE jobs
  SET items_json = jsonb_set(
      items_json,
      '{batch_discount_pct}',
      to_jsonb(batch_record.batch_discount_pct),
      true
    ),
    updated_at = NOW()
  WHERE id = ANY(batch_record.job_ids);

  GET DIAGNOSTICS discounted_count = ROW_COUNT;
  RETURN discounted_count;
END;
$$ LANGUAGE plpgsql;
