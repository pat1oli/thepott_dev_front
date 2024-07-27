const awsRegion = "us-east-1";
const identityPool = "us-east-1:4542b5db-74bb-4caf-a9b6-ade157b9e1b3";

const paramsGet = {
  TableName: 'VisitorCount',
  Key: {
    'id': { S: 'visitors' }
  }
};

let counter = document.querySelector("#counter");

AWS.config.update({
  region: awsRegion
});

AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: identityPool });

const dynamodb = new AWS.DynamoDB();

dynamodb.getItem(paramsGet, (err, data) => {
  if (err) {
    console.error("Unable to get visitor count. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    let currentCount = data.Item ? parseInt(data.Item.count_visitors.N) : 0;
    currentCount++;

    const paramsPut = {
      TableName: 'VisitorCount',
      Item: {
        'id': { S: 'visitors' },
        'count_visitors': { N: currentCount.toString() }
      }
    };

    dynamodb.putItem(paramsPut, (err, data) => {
      if (err) {
        console.error("Unable to update visitor count. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("Visitor count updated successfully.");
        counter.textContent = `Visiteurs: ${currentCount}`;
      }
    });
  }
});