export const generateCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    const randomCharacter = characters.charAt(randomIndex)
    code += randomCharacter
  }
  return code
}
