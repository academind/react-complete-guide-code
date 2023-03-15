using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using UnityEngine;

[System.Serializable]
public class Character{
	public string name;
	public int price;
}

//manages the player selection screen
public class PlayerShop : MonoBehaviour {
	
	public Character[] characters;
	
	public RuntimeAnimatorController idle;
	
	public Text nameLabel;
	
	public float dist;
    
	public float maxDragTime;
	public float dragDistance;
	
	public Transform cameraHolder;
	public float transitionSpeed;
	
	public Text diamonds;
	
	public GameObject rightButton;
	public GameObject leftButton;
	
	public GameObject unlockButton;
	
	public Text priceLabel;
	
	float startPos;
	float startTime;
	
	bool canSwitch;
	
	int current;
	
	Vector3 camTarget;
	
	int mannequinCount;
	
	GameObject playerPrefab;
	
	void Awake(){
		playerPrefab = Resources.Load<GameObject>("Character prefabs/Player base prefab");
		
		if(playerPrefab == null)
			Debug.LogWarning("No player prefab in resources");
	}
	
	void Start(){
		//diamonds to unlock all players:
		//PlayerPrefs.SetInt("Diamonds", 10000);
		
		bool doneLoading = false;
		Vector3 pos = Vector3.zero;
		
		//load all characters directly from the resources folder
		//instantiates one character for each unlockable outfit
		while(!doneLoading){
			Outfit next = Resources.Load<Outfit>("Player_" + mannequinCount);
			
			if(next != null){
				GameObject newMannequin = Instantiate(playerPrefab, pos, playerPrefab.transform.rotation);
				
				newMannequin.GetComponent<Animator>().runtimeAnimatorController = idle;
				newMannequin.GetComponent<Player>().enabled = false;
				
				newMannequin.GetComponentInChildren<ParticleSystem>().Stop();
				
				newMannequin.GetComponent<ModifyOutfit>().outfit = next;
				newMannequin.GetComponent<ModifyOutfit>().SetOutfit(false);
				
				mannequinCount++;
			}
			else{
				doneLoading = true;
			}
			
			pos += Vector3.right * dist;
		}
		
		//get the current player character and move the camera there
		current = PlayerPrefs.GetInt("Player");
		UpdateCamera();
		
		cameraHolder.position = Vector3.right * dist * current;
		
		//show diamonds
		UpdateDiamondsLabel();
	}
	
	void Update(){
		//move camera to currently selected character
		cameraHolder.position = Vector3.MoveTowards(cameraHolder.position, camTarget, Time.deltaTime * transitionSpeed);
		
		float currentPos = Input.mousePosition.x;
		
		//check for swipe motion to move the camera left and right
		if(Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began){
			startPos = currentPos;
			startTime = Time.time;
			
			canSwitch = true;
		}
		else if(Input.GetMouseButton(0) && canSwitch){
			if(Time.time - startTime > maxDragTime){
				canSwitch = false;
			}
			else if(Mathf.Abs(startPos - currentPos) > dragDistance){
				ChangeCharacter(currentPos < startPos);
				
				canSwitch = false;
			}
		}
	}
	
	//change currently selected character and update the camera accordingly
	public void ChangeCharacter(bool left){
		if((current == 0 && !left) || (current == mannequinCount - 1 && left))
			return;
		
		current += left ? 1 : -1;
		UpdateCamera();
	}
	
	//unlock the current character (if enough diamonds)
	public void Unlock(){
		if(PlayerPrefs.GetInt("Diamonds") < characters[current].price)
			return;
		
		PlayerPrefs.SetInt("Diamonds", PlayerPrefs.GetInt("Diamonds") - characters[current].price);
		PlayerPrefs.SetInt("Unlocked" + current, 1);
		PlayerPrefs.SetInt("Player", current);
		
		unlockButton.SetActive(false);
		
		//update new diamond count
		UpdateDiamondsLabel();
	}
	
	//select character and load game scene
	public void Select(){
		PlayerPrefs.SetInt("Player", current);
		
		SceneManager.LoadScene(0);
	}
	
	//get new camera target and update ui buttons
	void UpdateCamera(){
		camTarget = Vector3.right * dist * current;
		
		if(current < characters.Length)
			nameLabel.text = characters[current].name;
		
		bool unlocked = PlayerPrefs.GetInt("Unlocked" + current) == 1 || current < 4;
		
		unlockButton.SetActive(!unlocked);
		
		priceLabel.text = characters[current].price + "";
		
		leftButton.SetActive(current > 0);
		rightButton.SetActive(current < mannequinCount - 1);
	}
	
	//show new diamond count
	public void UpdateDiamondsLabel(){
		diamonds.text = PlayerPrefs.GetInt("Diamonds") + "";
	}
}
