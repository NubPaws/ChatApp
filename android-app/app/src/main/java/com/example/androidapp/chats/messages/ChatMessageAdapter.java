package com.example.androidapp.chats.messages;

import com.example.androidapp.R;
import com.example.androidapp.chats.database.entities.ChatMessage;

import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class ChatMessageAdapter extends RecyclerView.Adapter<ChatMessageAdapter.ChatViewHolder> {

    private List<ChatMessage> messages;

    public ChatMessageAdapter(List<ChatMessage> messages) {
        this.messages = messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }

    public void addMessages(List<ChatMessage> messages) {
        this.messages.addAll(messages);
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    @NonNull
    @Override
    public ChatViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.chat_message_view, parent, false);
        return new ChatViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ChatViewHolder holder, int position) {
        ChatMessage message = messages.get(position);

        holder.messageView.setText(message.getContent());
        holder.timestampView.setText(message.getTimestamp());
        switch (message.getDirection()) {
            case ChatMessage.DIR_LEFT:
                holder.layout.setGravity(Gravity.START);
                holder.msgContainer.setBackgroundResource(R.color.chat_msg_left_bg);
                break;
            case ChatMessage.DIR_RIGHT:
                holder.layout.setGravity(Gravity.END);
                holder.msgContainer.setBackgroundResource(R.color.chat_msg_right_bg);
                break;
        }
    }

    @Override
    public int getItemCount() {
        return messages.size();
    }

    static class ChatViewHolder extends RecyclerView.ViewHolder {

        LinearLayout layout;
        LinearLayout msgContainer;
        TextView messageView;
        TextView timestampView;

        public ChatViewHolder(@NonNull View itemView) {
            super(itemView);
            layout = itemView.findViewById(R.id.chat_message_layout);
            msgContainer = itemView.findViewById(R.id.chat_message_container);
            messageView = itemView.findViewById(R.id.message_text_view);
            timestampView = itemView.findViewById(R.id.message_timestamp_text_view);
        }
    }

}
