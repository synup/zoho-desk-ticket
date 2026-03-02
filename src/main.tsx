import { installNetworkLogger } from './utils/networkLogger'
import { installErrorLogger } from './utils/errorLogger'

export function installGlobalLoggers() {
  installNetworkLogger()
  installErrorLogger()
}
