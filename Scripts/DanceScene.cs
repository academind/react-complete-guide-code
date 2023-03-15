using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

[System.Serializable]
public class TournamentTitle{
	public string name;
	public Color textColor;
}

public class DanceScene : MonoBehaviour {
	
	public Renderer[] renderers;
    public Material winMat;
	public Material loseMat;
	public float duration;
	
	public Transform[] characters;
	public RuntimeAnimatorController idle;
	public RenderTexture[] characterTextures;
	public RawImage[] images;
	
	public Color winFog;
	public Color loseFog;
	
	public Text title;
	public Animator titleAnim;
	
	public string nextScene;
	
	[HideInInspector]
	public Animator player;
	
	[HideInInspector]
	public Animator opponent;
	
	public Text score;
	public Image bar;
	
	public AudioSource winAudio;
	public AudioSource loseAudio;
	
	public Text bonusLabel;
	
	public Animator mainPanel;
	public GameObject tournamentInfo;
	
	public Text tournamentTitle;
	public TournamentTitle[] tournamentNames;
	public Text tournamentSmallLabel;
	
	public Transform playerIndicator;
	public Transform[] targets;
	public float indicatorSpeed;
	
	public float revealDelay;
	public float tournamentPanelDuration;
	
	public Animator transition;
	
	public CanvasGroup tournamentGroup;
	public CanvasGroup cupGroup;
	
	public GameObject bonusButton;
	
	Vector3 indicatorTarget;
	bool moveIndicator;
	
	bool won = true;
	bool wonTournament;
	
	GameObject playerPrefab;
	GameObject opponentPrefab;
	
	void Awake(){
		#if UNITY_ADS
		TryAd();
		#endif
		
		playerPrefab = Resources.Load<GameObject>("Character prefabs/Player base prefab");
		opponentPrefab = Resources.Load<GameObject>("Character prefabs/Opponent base prefab");
		
		if(playerPrefab == null || opponentPrefab == null){
			Debug.LogWarning("No player/opponent prefab in resources");
		}
		
		//get the match info to check if we won (object marked as dontdestroyonload in the game scene)
		MatchInfo info = GameObject.FindObjectOfType<MatchInfo>();
		
		tournamentInfo.SetActive(false);
		
		bonusButton.SetActive(false);
		
		if(info == null)
			return;
		
		won = info.won;
		score.text = info.scoreText;
		
		//remove the info after we saved it
		Destroy(info.gameObject);
	}
	
	void Start(){
		bar.fillAmount = 0;
		
		//check if we won or lost the match and set tournament values accordingly
		if(won){
			RenderSettings.fogColor = winFog;
			Camera.main.backgroundColor = winFog;
			
			title.text = "Winner";
			
			player.SetInteger("Type", Random.Range(1, 8));
			
			int tournament = PlayerPrefs.GetInt("Tournament");
			int tournamentMatch = PlayerPrefs.GetInt("Tournament Match Number");
			
			if(tournamentMatch == 0)
				SetCharacterData();
			
			LoadCharacters();
			
			int tournamentRange = tournament % tournamentNames.Length;
			
			tournamentTitle.text = tournamentNames[tournamentRange].name;
			tournamentTitle.color = tournamentNames[tournamentRange].textColor;
			
			Color shadowColor = tournamentNames[tournamentRange].textColor;
			shadowColor.a = 0.5f;
			tournamentTitle.gameObject.GetComponent<Shadow>().effectColor = shadowColor;
			tournamentSmallLabel.text = "Tournament #" + (tournament + 1);
			
			PlayerPrefs.SetInt("Match", PlayerPrefs.GetInt("Match") + 1);
			PlayerPrefs.SetInt("Tournament Match Number", PlayerPrefs.GetInt("Tournament Match Number") + 1);
			
			if(PlayerPrefs.GetInt("Tournament Match Number") == 3){
				PlayerPrefs.SetInt("Tournament Match Number", 0);
				PlayerPrefs.SetInt("Tournament", tournament + 1);
				
				wonTournament = true;
			}
			
			winAudio.Play();
		}
		else{
			RenderSettings.fogColor = loseFog;
			Camera.main.backgroundColor = loseFog;
			
			title.text = "Keep trying!";
			
			opponent.SetInteger("Type", Random.Range(1, 8));
			
			int tournamentMatchNumber = PlayerPrefs.GetInt("Tournament Match Number");
			PlayerPrefs.SetInt("Tournament Match Number", 0);
			
			PlayerPrefs.SetInt("Match", PlayerPrefs.GetInt("Match") - tournamentMatchNumber);
			
			loseAudio.Play();
		}
		
		titleAnim.SetBool("Won", won);
		
		foreach(Renderer rend in renderers){
			rend.material = won ? winMat : loseMat;
		}
	}
	
	//update the bottom bar and move the player indicator around
	void Update(){
		bar.fillAmount += Time.deltaTime/duration;
		
		if((Input.GetMouseButtonDown(0) || bar.fillAmount >= 1f) && !tournamentInfo.activeSelf)
			StartCoroutine(Continue());
		
		if(moveIndicator){
			playerIndicator.position = Vector3.MoveTowards(playerIndicator.position, indicatorTarget, Time.deltaTime * indicatorSpeed);
			
			if(Input.GetMouseButtonDown(0))
				StartCoroutine(LoadScene(false));
		}
	}
	
	#if UNITY_ADS
	void TryAd(){
		AdManager adManager = GameObject.FindObjectOfType<AdManager>();
		
		if(adManager == null)
			return;
		
		adManager.Interstitial();
	}
	#endif
	
	//at the start of each tournament, get some (random) characters from the resources and save those for the following matches
	void SetCharacterData(){
		PlayerPrefs.SetInt("Middle Layer Player Opponent", Random.Range(0, 2) + 2);
		PlayerPrefs.SetInt("Middle Layer Top Character", Random.Range(0, 2) + 4);
		PlayerPrefs.SetInt("Middle Layer Bottom Character", Random.Range(0, 2) + 6);
		PlayerPrefs.SetInt("Middle Layer Winner", Random.Range(0, 2));
		
		int match = PlayerPrefs.GetInt("Match");
		
		PlayerPrefs.SetInt("Opponent 1", match);
		
		int randomCharacter = Random.Range(0, 200);
		int middleOpponent = PlayerPrefs.GetInt("Middle Layer Player Opponent");
		
		PlayerPrefs.SetInt("Opponent 2", middleOpponent == 2 ? match + 1 : randomCharacter);
		PlayerPrefs.SetInt("Opponent 3", middleOpponent == 3 ? match + 1 : randomCharacter);
		
		int middleLayerWinnerTop = PlayerPrefs.GetInt("Middle Layer Winner") == 0 ? PlayerPrefs.GetInt("Middle Layer Top Character") : PlayerPrefs.GetInt("Middle Layer Bottom Character");
		//int thirdOpponentTopPosition = middleLayerWinnerTop + PlayerPrefs.GetInt("Middle Layer Winner") == 0 ? 4 : 6;
		
		for(int i = 4; i < 8; i++){
			PlayerPrefs.SetInt("Opponent " + i, Random.Range(0, 200));
		}

		PlayerPrefs.SetInt("Opponent " + middleLayerWinnerTop, match + 2);
	}
	
	//initialize the tournament characters
	void LoadCharacters(){
		GameObject playerCharacter = Instantiate(playerPrefab, characters[0].position, characters[0].rotation);
		playerCharacter.GetComponent<Player>().enabled = false;
		playerCharacter.GetComponent<Animator>().runtimeAnimatorController = idle;
		
		for(int i = 1; i < 8; i++){
			int index = PlayerPrefs.GetInt("Opponent " + i);
			
			GameObject opponentCharacter = Instantiate(opponentPrefab, characters[i].position, characters[i].rotation);
			opponentCharacter.GetComponent<ModifyOutfit>().Initialize(index);
			opponentCharacter.GetComponent<Opponent>().enabled = false;
			opponentCharacter.GetComponent<Animator>().runtimeAnimatorController = idle;
		}
	}
	
	//correctly assign textures in the tournament graph based on who won which match
	IEnumerator AssignTextures(int tournamentMatch){
		int middleLayerTop = PlayerPrefs.GetInt("Middle Layer Top Character");
		int middleLayerBottom = PlayerPrefs.GetInt("Middle Layer Bottom Character");
		
		int targetIndex = tournamentMatch > 0 ? 2 : 1;
		indicatorTarget = targets[targetIndex].position;
		playerIndicator.position = targets[targetIndex - 1].position;
		
		if(wonTournament)
			playerIndicator.position = targets[2].position;
		
		float delay = tournamentMatch > 0 ? 0f : revealDelay;
		
		yield return new WaitForSeconds(delay * 2f);
		images[0].texture = characterTextures[0];
			
		yield return new WaitForSeconds(delay);
		images[1].texture = characterTextures[PlayerPrefs.GetInt("Middle Layer Player Opponent")];
			
		yield return new WaitForSeconds(delay);
		images[2].texture = characterTextures[middleLayerTop];
			
		yield return new WaitForSeconds(delay);
		images[3].texture = characterTextures[middleLayerBottom];
		
		if(tournamentMatch > 0){
			//player character image
			yield return new WaitForSeconds(revealDelay);
			images[4].texture = characterTextures[0];
			
			yield return new WaitForSeconds(revealDelay);
			int bottomMostTexture = PlayerPrefs.GetInt("Middle Layer Winner") == 0 ? middleLayerTop : middleLayerBottom;
			images[5].texture = characterTextures[bottomMostTexture];
		}
	}
	
	//continue after dancing and show the tournament or trophy (continue directly if we didn't win the match)
	IEnumerator Continue(){
		if(!won){			
			SceneManager.LoadScene(nextScene);
			
			yield break;
		}
		
		tournamentInfo.SetActive(true);
		mainPanel.SetTrigger("Fade");
		
		if(!wonTournament){
			StartCoroutine(AssignTextures(PlayerPrefs.GetInt("Tournament Match Number") - 1));
			
			yield return new WaitForSeconds(revealDelay * 5f);
		
			moveIndicator = true;
		}
		else{
			tournamentGroup.alpha = 0;
			cupGroup.alpha = 1;
			
			bonusButton.SetActive(true);
		}
	}
	
	//load the bonus scene
	public void LoadBonus(){
		StartCoroutine(LoadScene(true));
	}
	
	//load a scene (bonus scene or next scene)
	IEnumerator LoadScene(bool bonus){
		transition.SetTrigger("transition");
		
		yield return new WaitForSeconds(1f/4f);
		
		SceneManager.LoadScene(bonus ? "Bonus" : nextScene);
	}
}
