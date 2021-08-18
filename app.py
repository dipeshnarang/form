from flask import Flask, render_template, flash, redirect, url_for, session, request, logging
import sys

#from werkzeug import datastructures
# import ldap
import json

app = Flask(__name__)

@app.route('/')

def index():
    return render_template('index.html')

@app.route('/ldap', methods=["POST"])

def ldap():
    data=request.get_json(force=True)
    for i in data:
        ans=authenticate('192.168.9.250','dipesh','Devops123@rtds',i['logonName'])
        #ans="not found"
        if(ans=="not found"):
            i['verified']=1
        elif(ans=="found"):
            i['verified']=2
        else:
            pass
 
        print(data)
        return json.dumps(data)


def authenticate(address, username, password,logonname):
    conn = ldap.initialize('ldap://' + address)
    conn.protocol_version = 3
    conn.set_option(ldap.OPT_REFERRALS, 0)
    result = conn.simple_bind_s(username, password)
    criteria = f"(&(objectClass=user)(sAMAccountName={logonname}))"
    res = conn.search_s("OU=VDI Clients,DC=test,DC=local",ldap.SCOPE_SUBTREE,criteria)
    if not res:
        return "not found"
    else:
        return  "found"



if __name__ == '__main__':
    app.secret_key='12345'
    app.run(debug=True)