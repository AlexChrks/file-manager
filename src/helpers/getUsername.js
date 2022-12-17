export const getUsername = () => {
  const usernameArg = process.argv.find((arg) => arg.includes('--username='))
  if (!usernameArg) {
    throw new Error('username argument is not provided. Provide username as follows: --username=<your_username>\'')
  }
  return usernameArg.slice(11, usernameArg.length)
}