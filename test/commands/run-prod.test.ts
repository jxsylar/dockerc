import {expect, test} from '@oclif/test'

describe('run-prod', () => {
  test
  .stdout()
  .command(['run-prod'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['run-prod', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
