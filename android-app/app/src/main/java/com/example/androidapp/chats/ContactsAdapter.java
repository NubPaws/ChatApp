package com.example.androidapp.chats;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.androidapp.R;

import java.util.List;

public class ContactsAdapter extends BaseAdapter {

    private List<ContactCard> cards;

    private static class ViewHolder {
        ImageView profileImage;
        TextView displayName;
        TextView lastMessage;
    }

    public ContactsAdapter(List<ContactCard> cards) {
        this.cards = cards;
    }

    @Override
    public int getCount() {
        return cards.size();
    }

    @Override
    public Object getItem(int position) {
        return cards.get(position);
    }

    @Override
    public long getItemId(int position) {
        return cards.get(position).getId();
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.contact_card_view, parent, false);

            ViewHolder viewHolder = new ViewHolder();
            viewHolder.profileImage = convertView.findViewById(R.id.contact_profile_pic_container)
                    .findViewById(R.id.contact_profile_pic);
            viewHolder.displayName = convertView.findViewById(R.id.display_name);
            viewHolder.lastMessage = convertView.findViewById(R.id.last_message);

            convertView.setTag(viewHolder);
        }

        ContactCard cc = cards.get(position);
        ViewHolder viewHolder = (ViewHolder)convertView.getTag();
        viewHolder.profileImage.setImageResource(cc.getProfileImage());
        viewHolder.displayName.setText(cc.getDisplayName());
        viewHolder.lastMessage.setText(cc.getLastMessage());

        return convertView;
    }

}
