use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :appointments, Appointments.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :appointments, Appointments.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "appointments_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# Openmaize authentication configuration
config :openmaize,
  user_model: Appointments.Employee,
  repo: Appointments.Repo,
  password_strength: [min_length: 6]
