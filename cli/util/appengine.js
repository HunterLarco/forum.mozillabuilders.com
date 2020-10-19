const child_process = require('child_process');

function deployApplication({ project, directory }) {
  const { status } = child_process.spawnSync(
    'gcloud',
    ['app', 'deploy', directory, '--project', project, '--quiet'],
    { stdio: [process.stdin, process.stdout, process.stderr] }
  );

  if (status == null || status != 0) {
    throw 'Deploy failed';
  }

  return 'Deploy finished';
}

function deployCronFile({ project, cron }) {
  const { status } = child_process.spawnSync(
    'gcloud',
    ['app', 'deploy', cron, '--project', project, '--quiet'],
    { stdio: [process.stdin, process.stdout, process.stderr] }
  );

  if (status == null || status != 0) {
    throw 'Deploy failed';
  }

  return 'Deploy finished';
}

module.exports = {
  deployDirectory,
  deployCronFile,
};
