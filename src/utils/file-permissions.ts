export function convertModeToPermissions(mode: number) {
  return "0" + (mode & parseInt("777", 8)).toString(8);
}
