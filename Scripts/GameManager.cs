using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine;

//color scheme consisting of a floor, background and court color
[System.Serializable]
public class ColorScheme{
	public Color floor;
	public Color background;
	public Color court;
}

public class GameManager : MonoBehaviour {
    
	public string winScene = "Dance scene";
	public bool playerServeOnly;
	public int pointsToWin = 3;
	public Animator transition;
	public Animator cameraZoom;
	public GameObject canvas;
	public VisitorSpawner visitors;
	public CameraMovement cameraMovement;
	
	public GameObject ball;
	
	[HideInInspector]
	public Player player;
	
	[HideInInspector]
	public Opponent opponent;
	
	public Transform spawnPos;
	public Transform opponentSpawnPos;
	public Animator countDown;
	public Transform scoreCamTarget;
	public GameObject[] confetti;
	
	public Text playerPointsLabel;
	public Text opponentPointsLabel;
	
	public Animator playerPointsAnim;
	public Animator opponentPointsAnim;
	
	public Animator matchPoint;
	
	public Color streakColor;
	public Color streakGoneColor;
	public ColorScheme[] colorSchemes;
	public Material floor;
	public Material stadium;
	public Material court;
	
	public AudioSource scorePointAudio;
	public AudioSource losePointAudio;
	public AudioSource matchPointAudio;
	
	public GameObject audioLine;
	public GameObject vibrateLine;
	public Animator pausePanel;
	public GameObject characterAvailableIcon;
	
	[Header("Bonus scene only")]
	public bool bonus;
	public Animator bonuspopup;
	public Text bonuspopupLabel;
	public Text diamondsLabel;
	public Animator diamondLabelAnim;
	
	public int maxBonusTargets;
	
	//haptic feedback setting can be found in the settings menu in game
	bool useHapticFeedback;
	
	int playerPoints;
	int opponentPoints;
	
	Ball ballScript;
	
	bool resetting;
	bool playerServe;
	
	[HideInInspector]
	public int bonusDiamonds;
	
	void Awake(){		
		canvas.SetActive(true);
	}
	
	void Start(){
		//initialize colors, player, confetti and audio
		foreach(GameObject conf in confetti){
			conf.SetActive(false);
		}
		
		SetColorScheme();
		player.SetBar(true);
		
		SetAudio(false);
		
		if(bonus){
			diamondsLabel.gameObject.SetActive(false);
		}
		else{
			characterAvailableIcon.SetActive(PlayerPrefs.GetInt("Diamonds") >= 20);
		}
	}
	
	void SetColorScheme(){
		//assign the colors from a randomly picked color scheme
		int random = Random.Range(0, colorSchemes.Length);
		
		floor.color = colorSchemes[random].floor;
		stadium.color = colorSchemes[random].background;
		court.color = colorSchemes[random].court;
	}
	
	//make the match info object, assign match info and continue to the dance scene
	public IEnumerator Done(bool wonMatch){
		transition.SetTrigger("transition");
		cameraZoom.SetTrigger("zoom");
		
		yield return new WaitForSeconds(1f/4f);
			
		GameObject matchInfo = new GameObject();
		MatchInfo info = matchInfo.AddComponent<MatchInfo>();
		
		info.won = wonMatch;
		info.scoreText = playerPoints + " - " + opponentPoints;
		
		DontDestroyOnLoad(matchInfo);
		
		SceneManager.LoadScene(winScene);
	}
	
	//create and assign a new ball
	public void Serve(){		
		GameObject newBall = Instantiate(ball, spawnPos.position, ball.transform.rotation);
		
		player.ball = newBall.transform;
		opponent.ball = newBall.transform;
		
		ballScript = newBall.GetComponent<Ball>();
	}
	
	//when the court is triggered, check who hit the ball last and based on that either lose or win a point
	public void CourtTriggered(bool net){
		if(net){
			if(ballScript.GetLastHit()){
				LosePoint();
			}
			else{
				WinPoint();
			}
		}
		else{
			if(ballScript.GetLastHit()){
				WinPoint();
			}
			else{
				LosePoint();
			}
		}
	}
	
	//with a fire ball, always win a point (and shake the camera for a nice effect)
	public void FireBall(){
		WinPoint();
		
		StartCoroutine(cameraMovement.Shake(0.2f, 1.2f));
	}
	
	//lose point when the ball doesn't make it over the net
	public void Out(){
		LosePoint();
	}
	
	//add a point to the opponent score
	void LosePoint(){
		opponentPoints++;
		
		if(!resetting)
			StartCoroutine(CheckAndReset(false));
	}
	
	//add a point to the player score
	void WinPoint(){
		playerPoints++;
		
		if(!resetting)
			StartCoroutine(CheckAndReset(true));
	}
	
	//handles full scoring, zooming, confetti, and reset mechanism
	IEnumerator CheckAndReset(bool wonPoint){
		resetting = true;
		
		if(bonus){
			StartCoroutine(BonusDone());
			
			yield break;
		}
		
		Vector3 playerPos = player.transform.position;
		playerPos.x = 0;
		player.SetTarget(playerPos);
		player.rangeCircle.SetBool("Show", false);
		
		Vector3 opponentPos = opponent.transform.position;
		opponentPos.x = 0;
		opponent.SetTarget(opponentPos);
		
		player.ComboDone(null);
		
		if(ballScript != null && !ballScript.inactive)
			ballScript.inactive = true;
		
		yield return new WaitForSeconds(0.75f);
		
		cameraMovement.SwitchTargetTemp(scoreCamTarget, 1.5f, 0.5f);
		
		yield return new WaitForSeconds(0.5f);
		
		if(wonPoint){
			visitors.Cheer();
			
			foreach(GameObject conf in confetti){
				conf.SetActive(true);
				
				yield return new WaitForSeconds(0.15f);
			}
			
			playerPointsAnim.SetTrigger("Effect");
			scorePointAudio.Play();
		}
		else{
			visitors.Disbelief();
			opponentPointsAnim.SetTrigger("Effect");
			losePointAudio.Play();
		}
		
		yield return new WaitForSeconds(1f/6f);
		
		opponentPointsLabel.text = "" + opponentPoints;
		playerPointsLabel.text = "" + playerPoints;
		
		GameObject.FindObjectOfType<PowerupBallSpawner>().RandomSpawn();
		
		yield return new WaitForSeconds(0.25f);
		
		if(playerPoints >= pointsToWin){
			StartCoroutine(Done(true));
		}
		else if(opponentPoints >= pointsToWin){
			StartCoroutine(Done(false));
		}
		else if(playerPoints == pointsToWin - 1 || opponentPoints == pointsToWin - 1){
			yield return new WaitForSeconds(0.5f);
			
			matchPoint.SetTrigger("Show");
			matchPointAudio.Play();
			
			yield return new WaitForSeconds(0.5f);
		}
		
		yield return new WaitForSeconds(1f);
		
		foreach(GameObject conf in confetti){
			conf.SetActive(false);
		}
		
		if(!playerServeOnly){
			if(playerServe){
				player.SetBar(true);
			}
			else{
				StartCoroutine(OpponentServe());
			}
		
			playerServe = !playerServe;
		}
		else{
			player.SetBar(true);
		}
		
		yield return new WaitForSeconds(1f);
		
		resetting = false;
	}
	
	//after the bonus is done, show the popup, wait, and load the game scene
	IEnumerator BonusDone(){
		PlayerPrefs.SetInt("Diamonds", PlayerPrefs.GetInt("Diamonds") + bonusDiamonds);
		bonuspopupLabel.text = "+" + bonusDiamonds;
		
		if(PlayerPrefs.GetInt("Bonus max") < maxBonusTargets - 3)
			PlayerPrefs.SetInt("Bonus max", PlayerPrefs.GetInt("Bonus max") + 1);
		
		bonuspopup.SetTrigger("Play");
		
		yield return new WaitForSeconds(1f);
		
		transition.SetTrigger("transition");
		
		yield return new WaitForSeconds(1f/4f);
		
		SceneManager.LoadScene(0);
	}
	
	//opponent serves first hit
	IEnumerator OpponentServe(){
		countDown.SetTrigger("Countdown");
		
		yield return new WaitForSeconds(3f);
		
		StartCoroutine(opponent.JustHit());
		
		opponent.anim.SetTrigger("Serve");
		
		yield return new WaitForSeconds(0.28f);
		
		Serve();
		opponent.HitBall(true, opponentSpawnPos);
	}
	
	//pause the game by freezing everything
	public void Pause(){
		pausePanel.SetBool("Show", !pausePanel.GetBool("Show"));
		
		StartCoroutine(Freeze(pausePanel.GetBool("Show")));
	}
	
	//freeze everything by changing the timescale
	IEnumerator Freeze(bool freeze){
		if(freeze){
			yield return new WaitForSeconds(1f/3f);
			
			Time.timeScale = 0;
		}
		else{
			Time.timeScale = 1;
		}
	}
	
	//handles the haptic setting (button in the game settings menu)
	//for the haptic implementation, I would recommend the Nice Vibrations asset
	//I couldn't add it to the asset, as it's a paid package
	public void SetHaptic(bool change){
		int haptic = PlayerPrefs.GetInt("Haptic");
		
		if(change){
			haptic = haptic == 0 ? 1 : 0;
			
			PlayerPrefs.SetInt("Haptic", haptic);
		}
		
		vibrateLine.SetActive(haptic == 1);
		
		useHapticFeedback = haptic == 0;
	}
	
	//handles the audio button
	public void SetAudio(bool change){
		int audio = PlayerPrefs.GetInt("Audio");
		
		if(change){
			audio = audio == 0 ? 1 : 0;
			
			PlayerPrefs.SetInt("Audio", audio);
		}
		
		audioLine.SetActive(audio == 1);
		
		AudioListener.volume = audio == 0 ? 1 : 0;
	}
	
	//load the character selection scene
	public void CharacterSelection(){
		SceneManager.LoadScene("Player shop");
	}
	
	//add diamonds to the total bonus collected and update the display label
	public void AddBonus(){
		bonusDiamonds++;
		
		scorePointAudio.Play();
		
		if(!diamondsLabel.gameObject.activeSelf)
			diamondsLabel.gameObject.SetActive(true);
		
		int max = 3 + PlayerPrefs.GetInt("Bonus max");
		
		if(bonusDiamonds >= max){
			resetting = true;
			diamondsLabel.gameObject.SetActive(false);
			
			StartCoroutine(BonusDone());
		}
		else{
			StartCoroutine(UpdateDiamondLabel());
		}
	}
	
	//update the diamonds label
	IEnumerator UpdateDiamondLabel(){
		diamondLabelAnim.SetTrigger("Play");
		
		yield return new WaitForSeconds(1f/6f);
		
		diamondsLabel.text = "" + bonusDiamonds;
	}
	
	public void Home(){
		Time.timeScale = 1;
		SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
	}
}
