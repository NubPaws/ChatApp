package com.example.androidapp.chats.contacts;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.androidapp.R;
import com.example.androidapp.chats.database.entities.ContactCard;
import com.example.androidapp.utils.JSDateParser;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.List;
import java.util.Locale;

public class ContactsAdapter extends BaseAdapter {

    private JSDateParser dateParser = new JSDateParser();

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
            viewHolder.profileImage = convertView.findViewById(R.id.contact_profile_pic);
            viewHolder.displayName = convertView.findViewById(R.id.display_name);
            viewHolder.lastMessage = convertView.findViewById(R.id.last_message);

            convertView.setTag(viewHolder);
        }

        ContactCard cc = cards.get(position);
        ViewHolder viewHolder = (ViewHolder)convertView.getTag();
        viewHolder.profileImage.setImageBitmap(cc.getProfileImageBitmap());
        viewHolder.displayName.setText(cc.getDisplayName());

        if (cc.getLastMessage() == null || cc.getLastMessage().isEmpty())
            viewHolder.lastMessage.setText("");
        else {
            dateParser.setDateStr(cc.getLastMessage());
            viewHolder.lastMessage.setText(dateParser.getFullDate());
        }

        return convertView;
    }

    public void setContacts(List<ContactCard> cards) {
        this.cards = cards;
    }

}
