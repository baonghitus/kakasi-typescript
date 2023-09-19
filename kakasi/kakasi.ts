import * as fs from 'fs'
import * as path from 'path'
import { spawn } from 'child_process'

export type kakasiOptions = {
  pathDir: string
  debug: boolean
  bin: string
  // child: { detached: boolean }
  // cmd: object
}

/**
 * KAKASI - Kanji Kana Simple Inverter
 * @see https://github.com/loretoparisi/kakasi
 */
export class kakasi {
  private _options: kakasiOptions

  private GetBinFolder = (filename: string) => {
    if (this._options.pathDir == '') {
      const pathComponents = __dirname.split('/')
      this._options.pathDir = pathComponents.slice(0, pathComponents.length).join('/')
    }

    const binpath = path.join(this._options.pathDir, 'bin/', process.platform, filename)

    process.env.ITAIJIDICTPATH = path.join(this._options.pathDir, 'data/itaijidict')
    process.env.KANWADICTPATH = path.join(this._options.pathDir, 'data/kanwadict')

    if (fs.existsSync(binpath)) {
      // check local binary path
      return binpath
    }
    return ''
  }

  private mergeRecursive = (obj1: kakasiOptions, obj2: Partial<kakasiOptions>) => {
    if (!obj2) {
      return obj1
    }

    for (const p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor == Object) {
          obj1[p] = this.mergeRecursive(obj1[p], obj2[p])
        } else {
          obj1[p] = obj2[p]
        }
      } catch (e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p]
      }
    }
    return obj1
  } //mergeRecursive

  constructor(options: Partial<kakasiOptions> = {}) {
    this._options = {
      pathDir: '',
      debug: false,
      bin: ''
    }
    this.mergeRecursive(this._options, options)

    if (!this._options.bin || this._options.bin == '') {
      this._options.bin = this.GetBinFolder('kakasi')
    }
  } //Kakasia

  public async transliterate(data: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return new Promise(function (resolve, reject) {
      let args
      args = ['-i', 'euc', '-Ha', '-Ka', '-Ja', '-Ea', '-ka', '-s', '-iutf8', '-outf8']
      const kakasi = spawn(self._options.bin, args, {})
      args = [data]
      const echo = spawn('echo', args, {})

      echo.stdout.pipe(kakasi.stdin)
      let res = ''
      kakasi.stdout.on('data', function (_data) {
        const data = new Buffer(_data, 'utf-8').toString()
        res += data
      })
      kakasi.stdout.on('end', function (_) {
        return resolve(res)
      })
      kakasi.on('error', function (error) {
        return reject(error)
      })

      if (self._options.debug) kakasi.stdout.pipe(process.stdout)
    })
  } //transliterate
}
