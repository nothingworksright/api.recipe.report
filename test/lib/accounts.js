#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the .
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const accounts = require(`../../lib/accounts`)
const datastore = require(`../../lib/datastore`)
const theMoment = require('moment')

describe(`Account management wrapper functions.`, () => {
  let email = `${new Date().getTime()}@recipe.report`
  let password = `password${new Date().getTime()}`
  it(`should connect to the datastore.`,
    async () => {
      await datastore.connect()
    }
  )
  it(`should fail to create (register) a new account without an email address.`,
    async () => {
      try {
        await accounts.create(undefined, password)
      } catch (err) {
        err.name.should.equal(`MissingUsernameError`)
        err.message.should.equal(`No email address was given.`)
      }
    }
  )
  it(`should fail to create (register) a new account without a password.`,
    async () => {
      try {
        await accounts.create(email, undefined)
      } catch (err) {
        err.name.should.equal(`MissingPasswordError`)
        err.message.should.equal(`No password was given.`)
      }
    }
  )
  it(`should create (register) a new account in the datastore.`,
    async () => {
      const account = await accounts.create(email, password)
      const itWasUpdated = account.updatedAt
      const itWasCreated = account.createdAt
      theMoment(itWasUpdated).isSame(Date.now(), `day`).should.equal(true)
      theMoment(itWasCreated).isSame(Date.now(), `day`).should.equal(true)
      account.salt.should.not.equal(undefined)
      account.hash.should.not.equal(undefined)
      account.email.should.equal(email)
      const itLastAttempted = account.last
      theMoment(itLastAttempted).isSame(Date.now(), `day`).should.equal(true)
      account.attempts.should.equal(0)
      account._id.should.not.equal(undefined)
      account.activated.should.equal(false)
      account.nickname.should.equal(`nickname`)
    }
  )
})