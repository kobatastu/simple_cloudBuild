# simple_cloudBuild

## 概要
- Cloud Buildを使うとGCP上でアプリのビルド、デプロイ作業が行える。ローカル環境で行わないのでビルド時に環境差分がない。
- Cloud Build自体はビルドしたものをGAEやGCF、Firebaseどこでもデプロイできる。今回はCloud Runについて考える
  - それぞれのデプロイ方法はドキュメント参照https://cloud.google.com/build/docs/how-to?hl=ja
- Cloud Buildでビルドされたイメージはcontainer registryにpushされ、cloud runにデプロイされる

## 手順
基本的にGCPドキュメント通りにやれば良いが前提としてデプロイコマンドやDockerfileが必要なので手順を書く
https://cloud.google.com/build/docs/deploying-builds/deploy-cloud-run?hl=ja

1. ソースコードを作成する。typescriptの場合、jsにビルドする必要があるのでnpm scriptにビルドコマンドを書いておく。実行コマンドも書いておくと良い（Dockerfile作成時に必要になる）
2. Dockerfileを作成する
  - Image名に大文字があると5でエラーになる
  - Dockerfileでnpm installをするので、node_modulesはimage内にコピーしなくていい。.dockerignoreを追加しnode_modulesを書いておく
3. Cloud Runのデプロイ権限をCloud Buildのサービスアカウントに付与するhttps://cloud.google.com/build/docs/deploying-builds/deploy-cloud-run?hl=ja#required_iam_permissions
4. cloudbuild.yamlを作成する。https://cloud.google.com/build/docs/deploying-builds/deploy-cloud-run?hl=ja#building_and_deploying_a_container を参考にすると、イメージのビルド、registryへのpush、cloud runへのデプロイが書いてあるのでサービスに合わせて変数を変更するだけでいい（サービスによってはビルドまでしかしていないものもある）
  - Submoduleなどビルド時にgitを参照するものは、別途stepの追加&cloud build サービスアカウントへの権限追加が必要
  - .gcloudignoreに隠しファイルを設定しておかないと5を実行時に指摘されるので、.gcloudignoreを設定し/.*を追加
5. 実行コマンドの追加（変数などオプションが必要な場合は追加する、その場合cloudbuild.yaml、Dockerfileも変更）
  - gcloud builds submitをnpm scriptに追加
