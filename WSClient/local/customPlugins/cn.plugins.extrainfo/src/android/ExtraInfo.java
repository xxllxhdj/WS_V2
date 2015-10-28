
package cn.plugins.extrainfo;

import android.app.Activity;
import android.content.Intent;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class ExtraInfo extends CordovaPlugin {
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Activity activity = this.cordova.getActivity();
        if (action.equals("getExtra")) {
            Intent i = activity.getIntent();
            if (i.hasExtra(Intent.EXTRA_TEXT)) {
                callbackContext.success(i.getStringExtra(Intent.EXTRA_TEXT));
            } else {
                callbackContext.error("Has no extra!");
            }
            return true;
        }
        return false;
    }
}