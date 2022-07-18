# simple_cloudBuild

## 概要
- Cloud Buildを使うとGCP上でアプリのビルド、デプロイ作業が行える。ローカル環境で行わないのでビルド時に環境差分がない。
- Cloud Build自体はビルドしたものをGAEやGCF、Firebaseどこでもデプロイできる。今回はCloud Runについて考える
  - それぞれのデプロイ方法は[ドキュメント参照](https://cloud.google.com/build/docs/how-to?hl=ja)
- Cloud Buildでビルドされたイメージはcontainer registryにpushされ、cloud runにデプロイされる

## 実行方法

```
npm i
# cloudbuild.yamlのPROJECT_ID、IMAGE_NAME、SERVICE_NAMEを自分のプロジェクトのGCPプロジェクトID、Container Registry 内のイメージ名、Cloud Runサービス名にそれぞれ書き換える。
npm run deploy
```

## 他プロジェクトでCloud Buildを使うときの手順
今回このサンプルを作ったときの手順と気をつける流れについて書く
基本的に[GCPドキュメント](https://cloud.google.com/build/docs/deploying-builds/deploy-cloud-run?hl=ja)通りにやれば良いが前提としてデプロイコマンドやDockerfileが必要なので手順を書く

1. ソースコードを作成する。typescriptの場合、jsにビルドする必要があるのでnpm scriptにビルドコマンドを書いておく。実行コマンドも書いておくと良い（Dockerfile作成時に必要になる）
2. Dockerfileを作成する
  - Image名に大文字があると5でエラーになる
  - Dockerfileでnpm installをするので、node_modulesはimage内にコピーしなくていい。.dockerignoreを追加しnode_modulesを書いておく
3. Cloud Runのデプロイ権限をCloud Buildのサービスアカウントに付与する。[参考](https://cloud.google.com/build/docs/deploying-builds/deploy-cloud-run?hl=ja#required_iam_permissions)
4. cloudbuild.yamlを作成する。[ドキュメント](https://cloud.google.com/build/docs/deploying-builds/deploy-cloud-run?hl=ja#building_and_deploying_a_container)を参考にすると、イメージのビルド、registryへのpush、cloud runへのデプロイが書いてあるのでサービスに合わせて変数を変更するだけでいい（サービスによってはビルドまでしかしていないものもある）
  - Submoduleなどビルド時にgitを参照するものは、別途stepの追加&cloud build サービスアカウントへの権限追加が必要
  - .gcloudignoreに隠しファイルを設定しておかないと5を実行時に指摘されるので、.gcloudignoreを設定し/.*を追加
5. 実行コマンドの追加（変数などオプションが必要な場合は追加する、その場合cloudbuild.yaml、Dockerfileも変更）
  - gcloud builds submitをnpm scriptに追加
