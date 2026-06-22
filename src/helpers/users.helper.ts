import pool from "../db";

type Auth0UserInput = {
  auth0_user_id: string;
  name?: string;
  email: string;
  image_url?: string;
};

export async function getOrCreateUser({
  auth0_user_id,
  name,
  email,
  image_url,
}: Auth0UserInput) {
  const result = await pool.query(
    `
    INSERT INTO users (
      auth0_id,
      name,
      email,
      image_url
    )
    VALUES (
      $1,
      $2,
      $3,
      $4
    )
    ON CONFLICT (auth0_id)
    DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      image_url = EXCLUDED.image_url
    RETURNING *
    `,
    [
      auth0_user_id,
      name || email,
      email,
      image_url || null,
    ]
  );

  return result.rows[0];
}