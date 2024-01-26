const newUser = {
  subject: "Welcome to List Shop Save",
  content: `Thank you for signing up to List Shop Save. This project was built by a group of students at the Jump and we are grateful you are a part of our journey. 
  Our website can be found at www.listshopsave.uk where you will be able to create a list of all your favourite items, compare against other major UK supermarkets and save on each item.
  If you have any further questions please email us at help@listshopsave.uk
  Kind regards,
  List Shop Save Team.`,
  html: 'Embedded image: <img src="cid:https://listshopsave.uk/images/PLACEHOLDERNEEDSREPLACING.png"/>',
  attachments: [
    {
      filename: "image.png",
      path: "./Logos/ListShopSave.png",
      cid: "https://listshopsave.uk/images/PLACEHOLDERNEEDSREPLACING.png", //same cid value as in the html img src
    },
  ],
};

module.exports = { newUser };
