defmodule Appointments.ConnCase do
  @moduledoc """
  This module defines the test case to be used by
  tests that require setting up a connection.

  Such tests rely on `Phoenix.ConnTest` and also
  imports other functionality to make it easier
  to build and query models.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      # Import conveniences for testing with connections
      use Phoenix.ConnTest

      alias Appointments.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query, only: [from: 1, from: 2]

      import Appointments.Router.Helpers
      import Appointments.Factory
      import OpenmaizeJWT.Create

      def create_token(company, employee) do
        {:ok, user_token} = %{
          id: employee.id,
          email: employee.email,
          role: employee.role,
          first_name: employee.first_name,
          company_id: company.id,
          company_name: company.name
        } |> generate_token({0, 86400})
      end

      # The default endpoint for testing
      @endpoint Appointments.Endpoint
    end
  end

  setup tags do
    unless tags[:async] do
      Ecto.Adapters.SQL.restart_test_transaction(Appointments.Repo, [])
    end

    {:ok, conn: Phoenix.ConnTest.conn()}
  end
end
