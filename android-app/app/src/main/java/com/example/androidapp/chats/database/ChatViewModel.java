package com.example.androidapp.chats.database;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.chats.database.entities.ChatMessage;
import com.example.androidapp.chats.database.entities.ContactCard;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ChatViewModel extends ViewModel {

    private MutableLiveData<List<ContactCard>> contacts;

    private MutableLiveData<List<ChatMessage>> messages;

    public MutableLiveData<List<ContactCard>> getContacts() {
        if (contacts == null)
            contacts = new MutableLiveData<>();
        return contacts;
    }

    public MutableLiveData<List<ChatMessage>> getMessages() {
        if (messages == null) {
            messages = new MutableLiveData<>();
        }
        return messages;
    }

    public void setContactCards(ContactCard... ccs) {
        getContacts().setValue(new ArrayList<>(Arrays.asList(ccs)));
    }

    public void setContactCards(List<ContactCard> cards) {
        getContacts().setValue(cards);
    }

    public void addContactCards(ContactCard... ccs) {
        List<ContactCard> cards = getContacts().getValue();
        if (cards == null)
            cards = new ArrayList<>();

        cards.addAll(Arrays.asList(ccs));
        getContacts().setValue(cards);
    }

    public ContactCard getContactCard(int position) {
        if (getContacts().getValue() != null)
            return getContacts().getValue().get(position);
        return null;
    }

    public void setChatMessages(ChatMessage... chatMessages) {
        getMessages().setValue(new ArrayList<>(Arrays.asList(chatMessages)));
    }

    public void setChatMessages(List<ChatMessage> messages) {
        getMessages().setValue(messages);
    }

    public void addChatMessages(ChatMessage... msgs) {
        List<ChatMessage> messages = getMessages().getValue();
        if (messages == null)
            messages = new ArrayList<>();

        messages.addAll(Arrays.asList(msgs));
        getMessages().setValue(messages);
    }

    public ChatMessage getChatMessage(int position) {
        if (getMessages().getValue() != null)
            return getMessages().getValue().get(position);
        return null;
    }

}
