SELECT hero
FROM `bi-environment-1271.pdp_prd_rpg_dl.Battle_1800_Boss_18004_Raid_10`,
UNNEST(complex_attribute_06) hero
WHERE event_date = "2020-03-09" and player_id='121949033659892881'
and key_gk=-8645685384649132482
and hero.key like '%speed%'
order by event_time desc
;

SELECT complex_attribute_06[0].firstTeam_stats_speed
FROM `bi-environment-1271.pdp_prd_rpg_dl.Battle_1800_Boss_18004_Raid_10'
WHERE event_date = "2020-03-09" and player_id='121949033659892881'
and key_gk=-8645685384649132482
and hero.key like '%speed%'
