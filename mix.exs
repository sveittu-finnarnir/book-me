defmodule Appointments.Mixfile do
  use Mix.Project

  def project do
    [app: :appointments,
     version: "0.0.1",
     elixir: "~> 1.0",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix, :gettext] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     test_coverage: [tool: ExCoveralls],
     preferred_cli_env: [
       "coveralls": :test,
       "coveralls.detail": :test,
       "coveralls.post": :test,
       "coveralls.html": :test,
       "covearlls.travis": :test
      ],
     aliases: aliases,
     deps: deps]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [mod: {Appointments, []},
     applications: [:phoenix, :phoenix_html, :cowboy, :logger, :gettext,
                    :phoenix_ecto, :postgrex,
                    :openmaize, :openmaize_jwt]]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [{:phoenix, "~> 1.1.4"},
     {:postgrex, ">= 0.0.0"},
     {:phoenix_ecto, "~> 2.0"},
     {:phoenix_html, "~> 2.4"},
     {:gettext, "~> 0.9"},
     {:cowboy, "~> 1.0"},
     {:poison, "~> 1.0"},
     {:openmaize, "~> 0.18"},
     {:openmaize_jwt, "~> 0.9"},
     {:ex_json_schema, "~> 0.4.0"},

     # For country data
     {:yamerl, github: "yakaz/yamerl"},
     {:countries, github: "SebastianSzturo/countries"},

     {:phoenix_live_reload, "~> 1.0", only: :dev},
     {:excoveralls, "~> 0.5", only: :test},
     {:credo, "~> 0.3", only: [:dev, :test]},
     {:ex_machina, "~> 1.0.0-beta.1", github: "thoughtbot/ex_machina", only: :test}]
  end

  # Aliases are shortcut or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    ["ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
     "ecto.reset": ["ecto.drop", "ecto.setup"]]
  end
end
