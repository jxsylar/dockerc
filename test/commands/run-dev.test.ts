import {expect, test} from '@oclif/test'

describe('run-dev', () => {
  test
  .stdout()
  .command(['run-dev'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['run-dev', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
