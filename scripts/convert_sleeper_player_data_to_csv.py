# Description: Converts the Sleeper player data from JSON to CSV
# api -- https://api.sleeper.app/v1/players/nfl

import json
import csv

def json_to_csv(input_file, output_file):
    with open(input_file, 'r') as json_file:
        data = json.load(json_file)

    with open(output_file, 'w', newline='') as csv_file:
        writer = csv.writer(csv_file)
        first_row = True

        all_columns = []
        for player_id, player_data in data.items():
            if first_row:
                all_columns = list(player_data.keys())
                writer.writerow(['id'] + all_columns)
                first_row = False
            values = [player_id]
            for column_id in all_columns:
                if (column_id in player_data):
                    values.append(player_data[column_id])
                else:
                    values.append('')
            writer.writerow(values)

json_to_csv('players.json', 'players.csv')
