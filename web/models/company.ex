defmodule Appointments.Company do
  use Appointments.Web, :model

  schema "companies" do
    field :name, :string
    field :phone, :string
    field :email, :string
    field :description, :string

    has_many :employees, Appointments.Employee

    timestamps
  end

  @required_fields ~w(name)
  @optional_fields ~w(phone email description)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> validate_length(:name, min: 1, max: 100)
  end
end
