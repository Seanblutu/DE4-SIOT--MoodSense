
import tweepy
import re
import datetime as dt
import time
from textblob import TextBlob
import csv
import threading

class TwiterClient(object):
    # Twitter class for sentiment analysis

    def __init__(self):
        #relevant keys and tokens for twitter dev
        consumer_key = "uYC7dSQKWRJ7gSxkkd9LQzPQI"
        consumer_secret_key = "JJQ4CLv1eQYXtxe4k2PCfq9aYJk3t9LnhFG2yP1sdfMSIbmwDW"
        Bearer_token = "AAAAAAAAAAAAAAAAAAAAAOB9IwEAAAAAInTrApRd5QDH6cOFv1rKpucBfGY%3DPmFqazEiBnfGPYaZF0LKtSPwmFQPCDYayujPEN2In59MEW6wxK"
        
        # try to authenticate 
        try:
            self.auth = tweepy.AppAuthHandler(consumer_key, consumer_secret_key)
            self.api = tweepy.API(self.auth)
        except:
            print("Error: Authentication Failed")
        self.last_tweet = None

    def clean_tweet(self,tweet):
        # function to remove special characters etc
        return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", tweet).split()) 
    
    def get_sentiment(self,tweet):
        # function to determine the sentiment of tweets passed into it using textblob
        analysis = TextBlob(self.clean_tweet(tweet))
        #set sentiment 
        if analysis.sentiment.polarity > 0:
            return "positive"
        elif analysis.sentiment.polarity == 0:
            return "neutral"
        else:
            return "negative" 
        
    def get_tweets(self,geo,q):
        tweets =[]
        try:
            stored_tweets = tweepy.Cursor(self.api.search,geocode=geo,since_id = q).items(100)
            count = 0
            pos = 0
            since = q
            for tweet in stored_tweets:
                if pos ==0 :
                    since = tweet.id
                    pos+=1
                parsed_tweet = {}
                parsed_tweet['text']=tweet.text
                parsed_tweet['sentiment']=self.get_sentiment(tweet.text)
                
                if tweet.retweet_count>0:
                    if parsed_tweet not in tweets:
                        tweets.append(parsed_tweet)
                        count += 1
                        
                else:
                    tweets.append(parsed_tweet)
                    count += 1

            print(count) 
            return tweets,since
        except tweepy.TweepError as e:
            print("Error : " + str(e))

def store(file,mode,item):

    with open(file,mode,newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(item)

def main(b,name):
    try:
        api = TwiterClient()

        tweets,c = api.get_tweets("51.521441,-0.313486,10km",b)
        if len(tweets) > 0:
            ptweets = [tweet for tweet in tweets if tweet['sentiment'] == 'positive']
            print("Positive tweets percentage: {} %".format(100*len(ptweets)/len(tweets))) 
            pt = 100*len(ptweets)/len(tweets)     
       # picking negative tweets from tweets 
            ntweets = [tweet for tweet in tweets if tweet['sentiment'] == 'negative'] 
        # percentage of negative tweets 
            print("Negative tweets percentage: {} %".format(100*len(ntweets)/len(tweets))) 
            nt = 100*len(ntweets)/len(tweets)
        # percentage of neutral tweets 
            print("Neutral tweets percentage: {} % \ ".format(100*(len(tweets) -(len( ntweets )+len( ptweets)))/len(tweets)))
            net = 100*(len(tweets)-(len(ntweets)+len(ptweets)))/len(tweets)
        
            mood= {pt :1,
               nt : -1,
               net : 0}

            fin= [pt,nt]
            fin.sort()
            fin = fin[-1]
            print(fin)
            store(name,'a',[dt.datetime.now().strftime("%H:%M:%S"),mood[fin]])
        else:
            print("No new tweets")
        return c
    except:
        print("Authentication error")
    
    return b

start = time.time()

consumer_key = "uYC7dSQKWRJ7gSxkkd9LQzPQI"
consumer_secret_key = "JJQ4CLv1eQYXtxe4k2PCfq9aYJk3t9LnhFG2yP1sdfMSIbmwDW"
Bearer_token = "AAAAAAAAAAAAAAAAAAAAAOB9IwEAAAAAInTrApRd5QDH6cOFv1rKpucBfGY%3DPmFqazEiBnfGPYaZF0LKtSPwmFQPCDYayujPEN2In59MEW6wxK"

auth = tweepy.AppAuthHandler(consumer_key, consumer_secret_key)
api = tweepy.API(auth)
a = tweepy.Cursor(api.search,geocode="51.521441,-0.313486,10km").items(1)
b = None
for t in a:
    b = t.id
print(b)
end = time.time()

print (end-start)
while True:
    end = time.time() + 43200
    file = "/home/pi/Documents/IOT/"+dt.datetime.now().strftime("%d-%m-%y(%H)")
    csvfile = open(file,"w+")
    csvfile.close()
    print(file)
    print("start")
    while time.time()<end:
        b = main(b,file)
        time.sleep(300)
