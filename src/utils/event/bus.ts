class Bus {
  _queue: any[] = []
  on(key: string, func: any) {
    this._queue.push({ key, func })
  }
  off(key: string) {
    this._queue.find(val => {
      if (val.key === key) {
        // splice
      }
    })
  }
  emit(key: string, args: any[]) {
    this._queue.forEach(val => {
      if (key === val.key && typeof val.func === 'function') {
        val.func.apply(this, args)
      }
    })
  }
}

const bus = new Bus()

export default bus
