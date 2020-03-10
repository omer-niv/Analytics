SELECT DATETIME_TRUNC(datetime(event_time),hour), 'Vikings',count(1)
FROM `bi-environment-1271.pdp_prd_strategy_dl.Login_1300_Root_13000_Vikings_602`
WHERE (event_date) >= "2020-01-01"
group by 1
order by 1