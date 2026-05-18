import { spawn } from 'node:child_process'

const [, , command, ...args] = process.argv

if (!command) {
  console.error('Usage: node scripts/run-electron-vite.mjs <command> [...args]')
  process.exit(1)
}

const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE
const executable = process.platform === 'win32' ? 'electron-vite.cmd' : 'electron-vite'

const child = spawn(executable, [command, ...args], {
  env,
  stdio: 'inherit'
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
