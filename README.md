
# Deploy CountdownTimer App using AWS CI/CD

This project deploys the "Countdown Timer" web application using AWS CI/CD (Continuous Integration and Continuous Deployment) tools such as CodeCommit, CodeBuild, CodeDeploy and CodePipeline. The application allows users to set a countdown timer and watch it count down to zero.


## Deployment Steps Performed
Here are the steps I followed to deploy the "CountdownTimer" app using AWS CI/CD services:

* Generated HTTPS Git credentials for AWS CodeCommit for IAM user. 
* Created a new AWS CodeCommit repository *Countdown-Timer-App* to store the app's source code.
* Taken clone of *Countdown-Timer-App* into local machine using HTTPS Git credentials and pushed the source code files into repository.
* Created a Amazon S3 bucket to store the CodeBuild Artifacts.
* Started a build from CodeBuild with following configurations:
```
  Name : TimeApp-Build
  Source Provider : AWS CodeCommit
  Repository: Countdown-Timer-App
  Reference Type : Branch
  Branch : master
  Environment image : Managed image
  Operating System : Ubuntu
  Runtime(s) : Standard
  image : aws/codebuild/standard:7.0
  Use a buildspec file (No need to add filename, it will automatically take it from repo)
  Artifacts-1 primary : Amazon S3
  Bucket Name: <Enter bucket name created in above step>
  Artifacts packaging: Zip
```   
* Created a IAM role with name *CodeDeployRoleForEC2* and added **AmazonEC2RoleforAWSCodeDeploy** policy in it.
* Launched a EC2 instance with below configurations:
```
OS : Ubuntu
Security Group : allow 80, 22
key-pair
Choose CodeDeployRoleForEC2 from IAM instance profile dropdown
``` 
* SSH into server using key-pair and Performed below commands to install codedeploy agent on EC2:
```
sudo apt update
sudo apt install ruby-full
sudo apt install wget
cd /home/ubuntu
wget https://aws-codedeploy-ap-south-1.s3.ap-south-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo service codedeploy-agent status
```
* Created a IAM role with name *CodeDeployServiceRole* and added **AWSCodeDeployRole** policy in it.
* Created a Deployment group for CodeDeploy by below configurations:
```
Deployment Group Name : TimerApp-deploy-group
Service Role: CodeDeployServiceRole
Deployment Type: In-place
Environment configuration: Amazon EC2 instances
Choose Key --> Name, Value --> Name of Instance
Install AWS CodeDeploy Agent : Never (As we have already configured on our instance)
Untick Enable load balancing 
``` 
* Started a deployment with following configuration:
```
Revision type: My Application is stored in Amazon S3
Revision location : paste the location of artifact file created by codebuild from s3 bucket
    ex.,s3://demo-cicd-project/TimeApp-Build 
```
* To make above phases automative, created a CodePipeline with below configuration:
```
Pipeline Settings:
Pipeline Name : TimerApp-Pipeline
Select New Service Role, role name will automatically populate

Add source stage:
Source provider: AWS CodeCommit
Repository Name: Countdown-Timer-App 
Branch Name : your brnach name (ex. master)
Change detection options : AWS CodePipeline
Output artifact format: CodePipeline default

Add build stage:
Build provider: AWS CodeBuild
Region: Automatically populated based on codebuild
Project name: TimerApp-Build
Build Type: Single build

Add deploy stage:
Deploy provider: AWS CodeDeploy
Region: Automatically populated based on codedeploy
Application Name: CountdownTimerApp
Deployment group: TimerApp-deploy-group
```
 
