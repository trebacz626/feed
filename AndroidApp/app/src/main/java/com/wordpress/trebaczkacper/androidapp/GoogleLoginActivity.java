package com.wordpress.trebaczkacper.androidapp;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.annotation.NonNull;
import android.support.annotation.RequiresApi;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.app.LoaderManager.LoaderCallbacks;

import android.content.CursorLoader;
import android.content.Loader;
import android.database.Cursor;
import android.net.Uri;
import android.os.AsyncTask;

import android.os.Build;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.Scopes;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.Scope;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import static android.Manifest.permission.READ_CONTACTS;
import static com.wordpress.trebaczkacper.androidapp.R.id.password;

/**
 * A login screen that offers login via email/password.
 */
public class GoogleLoginActivity extends AppCompatActivity implements GoogleApiClient.OnConnectionFailedListener,

        View.OnClickListener{

    private DBHandler dbHandler;


    /**
     * Id to identity READ_CONTACTS permission request.
     */

    private static final String TAG = "SignInActivity";

    private static final int RC_SIGN_IN = 9001;



    private GoogleApiClient mGoogleApiClient;

    private TextView mStatusTextView;

    private ProgressDialog mProgressDialog;

    // UI references.
    private AutoCompleteTextView mEmailView;
    private EditText mPasswordView;
    private View mProgressView;
    private View mLoginFormView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_google_login);
        // Set up the login form.
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN).requestEmail().requestScopes(new Scope((Scopes.PLUS_LOGIN)),new Scope((Scopes.PLUS_ME)))
         .requestIdToken("878826402052-vuv9orc3m91ujqb572c3gls5hkdjg6rk.apps.googleusercontent.com").requestServerAuthCode("878826402052-vuv9orc3m91ujqb572c3gls5hkdjg6rk.apps.googleusercontent.com",false)
         .build();


// Build a GoogleApiClient with access to the Google Sign-In API and the
// options specified by gso.
        mGoogleApiClient = new GoogleApiClient.Builder(this)
         .enableAutoManage(this /* FragmentActivity */, this /* OnConnectionFailedListener */)
         .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
         .build();

        SignInButton signInButton = (SignInButton) findViewById(R.id.sign_in_button);
        signInButton.setSize(SignInButton.SIZE_STANDARD);
        signInButton.setOnClickListener(this);

        mStatusTextView=(TextView) findViewById(R.id.sumtextView);
    }



    /**
     * Callback received when a permissions request has been completed.
     */



    /**
     * Attempts to sign in or register the account specified by the login form.
     * If there are form errors (invalid email, missing fields, etc.), the
     * errors are presented and no actual login attempt is made.
     */

    /**
     * Shows the progress UI and hides the login form.
     */
    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private void showProgress(final boolean show) {
        // On Honeycomb MR2 we have the ViewPropertyAnimator APIs, which allow
        // for very easy animations. If available, use these APIs to fade-in
        // the progress spinner.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
            int shortAnimTime = getResources().getInteger(android.R.integer.config_shortAnimTime);

            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
            mLoginFormView.animate().setDuration(shortAnimTime).alpha(
                    show ? 0 : 1).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
                }
            });

            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mProgressView.animate().setDuration(shortAnimTime).alpha(
                    show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
                }
            });
        } else {
            // The ViewPropertyAnimator APIs are not available, so simply show
            // and hide the relevant UI components.
            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
        }
    }


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
         case R.id.sign_in_button:
             signIn();
             break;

 }
    }

    private void signIn() {
        Intent signInIntent = Auth.GoogleSignInApi.getSignInIntent(mGoogleApiClient);
         startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        mStatusTextView.setText("Connection Failed");
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
     super.onActivityResult(requestCode, resultCode, data);

     // Result returned from launching the Intent from GoogleSignInApi.getSignInIntent(...);
     if (requestCode == RC_SIGN_IN) {
     GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
         handleSignInResult(result);
     }
    }

    @RequiresApi(api = Build.VERSION_CODES.CUPCAKE)
    private void handleSignInResult(GoogleSignInResult result) {
        Log.d(TAG, "handleSignInResult:" + result.isSuccess());
     if (result.isSuccess()) {
     // Signed in successfully, show authenticated UI.
         GoogleSignInAccount acct = result.getSignInAccount();
         String idToken = acct.getIdToken();
         mStatusTextView.setText("Toke: "+ idToken);
         Log.d("D","Tokenn: "+ idToken);
         Log.d("D","Token: "+ acct.getServerAuthCode());
         SendPostRequest sPR = new SendPostRequest(new Callback(){
             @Override
             public void callback(Object json){
                 onJSONData((JSONObject)json);
             }
         });
         ArrayList<String[]> list= new ArrayList<String[]>();
         list.add(new String[]{"URL","http://10.0.2.2:8080/api/login/google"});
         list.add(new String[]{"code",acct.getServerAuthCode()});
         sPR.execute(list);
         updateUI(true);
        // Signed out, show unauthenticated UI.
         updateUI(false);
     }else{
         mStatusTextView.setText("FAILED");
     }
    }

    private void onJSONData(JSONObject json) {

        if(json!=null){
            User user = new User();
            Log.d("d","one");
            try {
                user.setName(json.getJSONObject("userInfo").getString("name"));
                user.setName(json.getJSONObject("userInfo").getString("email"));
                user.setToken(json.getJSONObject("userInfo").getString("token"));
            } catch (JSONException e) {
                e.printStackTrace();
            }

            try {
                dbHandler.deleteUser(user.getName());
            }catch(Exception e){
                Log.d("D",e.getMessage());
            }
            dbHandler.addUser(user);
            User user2 = dbHandler.getUser();

            //Toast.makeText(getApplicationContext(), "Logged as "+ email+" with pasword: "+password,Toast.LENGTH_LONG).show();
            Toast.makeText(getApplicationContext(), "Logged as "+ user2.getName()+" with pasword: "+user2.getToken(),Toast.LENGTH_LONG).show();
            Intent resultIntent = new Intent();
            resultIntent.putExtra("email", user2.getName());
            resultIntent.putExtra("token", user2.getToken());
            setResult(Activity.RESULT_OK, resultIntent);
            finish();
        }else{
            mStatusTextView.setText("FAILED");
        }

    }

    private void updateUI(boolean b) {
    }
}

