## Module Result Contract (v1)

All module handlers must return:

{
  status: string,
  message?: string,
  timestamp: string,
  meta?: {
    implemented: boolean,
    simulation?: boolean
  }
}
