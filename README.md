# BookMe

[![Build Status](https://travis-ci.org/sveittir-finnar/book-me.svg?branch=master)](https://travis-ci.org/sveittir-finnar/book-me)
[![Coverage Status](https://coveralls.io/repos/github/sveittir-finnar/book-me/badge.svg?branch=master)](https://coveralls.io/github/sveittir-finnar/book-me?branch=master)

## Setup

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Seed the database: `MIX_ENV=dev mix run priv/repo/seeds.exs`.
  * Install Node.js dependencies with `npm install`
  * Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

## TODOs

* ~~Services.~~
* ~~Registration of companies (and thus their first employee).~~
* ~~Companies should only be able to update their own employees.~~
* ~~Add a test that verifies that an unconfirmed user cannot log in.~~
* ~~Put [ex_machina](https://github.com/thoughtbot/ex_machina) into use.~~
* JavaScript in the `service/form.html.eex` template.
* Error handling (404, 500) etc. show proper pages.
* Actually send email confirmation when adding employees.
* The public page for a company.
* Appointments:
  * Business-facing appointment calendar.
  * Guarantee policy:
    1. Automatically accepted (default).
    2. Business must accept manually.
  * Rescheduling policy:
    * Can the customer reschedule or not?
  * Scheduling policy:
    * Every hour, every half hour, every quarter hour, every service duration.
