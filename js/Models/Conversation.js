class Conversation{

	constructor(id, user1, user2, textHint, messages, lastMessageDate){
		this.id = id;
		//Les users sont des vrais users
		this.user1 = user1;
		this.user2 = user2;
		this.textHint = textHint;
		this.messages = [];
		this.lastMessageDate = lastMessageDate;
	}
}