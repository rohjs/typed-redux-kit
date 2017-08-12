interface TrackableProperties {
  parent?: Trackable<any>
  isChanged: boolean
  shallow: boolean
}

export const isTrackable = (maybeTrackable: any) => {
  return (maybeTrackable as Trackable<any>).$trackable
}

export const setParentIfTrackable = (maybeTrackable: any, parent: Trackable<any>) => {
  if (isTrackable(maybeTrackable)) {
    (maybeTrackable as Trackable<any>).setParent(parent)
  }
}

export const initializeValue = (maybeTrackable: any, parent: Trackable<any>) => {
  if (isTrackable(maybeTrackable)) {
    if ((maybeTrackable as Trackable<any>).$trackable.isChanged) {
      maybeTrackable = maybeTrackable.clone()
    }
    (maybeTrackable as Trackable<any>).setParent(parent)
  }
  return maybeTrackable
}

export abstract class Trackable<T>  {
  public $trackable: TrackableProperties = {
    isChanged: false,
    shallow: false,
  }

  public abstract clone (): T
  public abstract onChildChange (child: any): void
  public abstract toJS (): any

  public markAsChanged () {
    this.$trackable.isChanged = true

    if (this.$trackable.parent) {
      this.$trackable.parent.onChildChange(this)
    }
  }

  public setParent (parent: Trackable<any>) {
    this.$trackable.parent = parent
  }
}