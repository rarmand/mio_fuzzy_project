#!/usr/bin/env python3

import json

import flask


app = flask.Flask(__name__, template_folder="static/templates")

def read_json_file(path):

	with open(path) as offers_file:
		offers_json = json.load(offers_file)
		return offers_json

@app.route("/")
def index():

	return flask.render_template("index.html")
	
@app.route('/job-icon', methods=['GET'])
def fetch_job_icon():

	return flask.send_file('storage/markers/suitcase-15.svg', mimetype='image/svg+xml')
	
@app.route('/home-icon', methods=['GET'])
def fetch_home_icon():

	return flask.send_file('storage/markers/home-15.svg', mimetype='image/svg+xml')

@app.route('/markers', methods=['GET'])
def fetch_all_offers_json():

	return json.dumps(read_json_file("storage/json/job-offers.json"))

@app.route('/best-offer', methods=['GET'])
def fetch_best_offer_json():

	experience = flask.request.args.get("experience", None, int)
	earnings = flask.request.args.get("earnings", None, int)
	distance = flask.request.args.get("distance", None, float)
	employees = flask.request.args.get("employees", None, int)
	offersExtended = json.loads(flask.request.args.get("offers"))

	#algorytm

	#ustalenie pozycji na którą klient może aplikować z podanym doświadczeniem
	position = ""
	if experience <= 1:
		position = "intern"
	elif experience > 1 and experience < 3:
		position = "junior"
	elif experience >= 3 and experience < 8:
		position = "regular"
	elif experience >= 8:
		position = "senior"

	#15 ofert do rozważenia
	score = {}

	for i in range(len(offersExtended)):
		job = offersExtended[i]
		score[i] = []
		#zarobki
		if earnings <= job['earnings'][position]:
			score[i].append(1.0)
		else:
			score[i].append( job['earnings'][position] / earnings )

		#liczba ludzi
		if employees >= job['employees']:
			score[i].append(1.0)
		else:
			score[i].append( employees / job['employees'] )

		#dystans
		if distance >= job['distance']:
			score[i].append(1.0)
		else:
			score[i].append( distance / job['distance'] )

	min_score = {key: min(val for val in score[key]) for key in score}

	#znajdź wszystkie indeksy z najlepszymi wynikami
	#wylosuj jeden wynik najlepszy
	from random import randrange

	maxscore_value = max(min_score.values())
	maxscore_list = [key for key, value in min_score.items() if value == maxscore_value]
	maxscore_index = randrange(len(maxscore_list))

	job = offersExtended[maxscore_list[maxscore_index]]
	final_offer = {}
	final_offer['name'] = job['name']
	final_offer['company'] = job['company']
	final_offer['address'] = job['address']
	final_offer['distance'] = job['distance']
	final_offer['coordinates'] = job['coordinates']
	final_offer['employees'] = job['employees']
	final_offer['position'] = position
	final_offer['earnings'] = job['earnings'][position]

	return json.dumps(final_offer)


if __name__ == "__main__":
	app.run()
