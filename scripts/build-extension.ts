import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const extension = resolve(root, 'extension')

rmSync(extension, { recursive: true, force: true })
mkdirSync(extension, { recursive: true })
cpSync(dist, extension, { recursive: true })
cpSync(resolve(root, 'public', 'manifest.json'), resolve(extension, 'manifest.json'))
cpSync(resolve(root, 'public', 'icons'), resolve(extension, 'icons'), { recursive: true })
