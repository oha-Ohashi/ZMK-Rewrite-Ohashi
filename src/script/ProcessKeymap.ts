export const hello = (): void => {

}

export function splitBindings (input: string): { insideBindings: string[], outsideBindings: string[] } {
  const regex = /bindings = <([^>]*)>/g
  let match
  const insideBindings = []
  const outsideBindings = []

  let lastIndex = 0
  while ((match = regex.exec(input)) !== null) {
    insideBindings.push(match[1])
    outsideBindings.push(input.slice(lastIndex, match.index))
    lastIndex = regex.lastIndex
  }
  outsideBindings.push(input.slice(lastIndex))

  return {
    insideBindings,
    outsideBindings
  }
}

export function parseInput (input: string): string[][] {
  // Split the input into lines
  const lines = input.split('\n')

  // Prepare the result
  const result: string[][] = []

  // For each line
  for (let line of lines) {
    // Trim extra spaces
    line = line.trim()

    // If the line is not empty
    if (line !== '') {
      // Find the '&' sections
      const sections = line.split('&').slice(1)

      // Trim the sections and add to result
      result.push(sections.map(section => section.trim()))
    }
  }

  // Return the result
  return result
}

export const mergeInputIntoSplitInside = (
  core: string[][][],
  nSpaces: number,
  splitter: string
): string[] => {
  const lineHead = new Array<string>(nSpaces).fill(' ').join('')
  return core.map((layer) => {
    const rows = layer.map((row) => {
      return row.map((col) => '&' + col).join(' ')
      // return row.join(' ')
    })

    return 'bindings = <' + splitter + lineHead + rows.join(splitter + lineHead) + '>'
  })
}

export const mergeSplitCodes = (inside: string[], outside: string[]): string => {
  let res: string = ''
  let i: number
  for (i = 0; i < inside.length; i++) {
    res += outside[i]
    res += inside[i]
  }
  res += outside[i]
  return res
}

export const downloadTextFile = (text: string, filename: string): void => {
  // Create a blob of the text
  const blob = new Blob([text], { type: 'text/plain' })
  // Create a link element
  const a = document.createElement('a')
  // Set the link's href to the blob's URL
  a.href = URL.createObjectURL(blob)
  // Set the link's download attribute to the desired file name
  a.download = filename
  // Append the link to the body
  document.body.appendChild(a)
  // Simulate a click on the link
  a.click()
  // Clean up: remove the link from the body
  document.body.removeChild(a)
}

export function openTextInNewTab (content: string): void {
  // Create a Blob object with the content.
  const blob = new Blob([content], { type: 'text/plain' })
  // Create a URL for the Blob object.
  const url = URL.createObjectURL(blob)
  // Open the URL in a new tab.
  window.open(url, '_blank')
}
