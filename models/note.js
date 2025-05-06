class Notes {
  constructor(title) {
    this.id = "1"
    this.title = title
    this.dateCreated = new Date()
    this.dateUpdated = new Date()
    this.isComplete = false
  }

  setStatus(status) {
    this.isComplete = status
  }

  setTitle(title) {
    this.title = title
    this.dateUpdated = new Date()
  }

  getInfo() {
    return {
      id: this.id,
      title: this.title,
      status: this.isComplete,
      created: this.dateCreated,
      updated: this.dateUpdated,
    }
  }

}
