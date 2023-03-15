using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ModifyOutfit : MonoBehaviour {
	
	//outfit scriptable object to use
	public Outfit outfit;
	
	public Renderer character;
	public Renderer racket;
	public Renderer[] hatRenderers;
	public GameObject glasses;
	public GameObject[] hats;
	public GameObject[] hair;
	public GameObject skirt;
	
	public int rendererPantsIndex = 0;
	public int rendererShirtIndex = 1;
	public int rendererSkinIndex = 2;
	public int rendererShoesIndex = 3;
	
	public bool player;
	public bool dontUpdateOnAwake;
	
	//if we want to update this outfit on awake, call SetOutfit using the match retrieved from playerprefs
	void Awake(){
		if(dontUpdateOnAwake)
			return;
		
		if(!player){
			int index = PlayerPrefs.GetInt("Match");
			outfit = Resources.Load<Outfit>("Outfit_" + index);
		}
		else{
			int index = PlayerPrefs.GetInt("Player");
			outfit = Resources.Load<Outfit>("Player_" + index);
		}
		
		SetOutfit(false);
	}
	
	//initialize the outfit using an index from outside of this class
	public void Initialize(int index){
		outfit = Resources.Load<Outfit>("Outfit_" + index);
		SetOutfit(false);
	}
	
	//assign all character features and colors using the loaded outfit object
	//checking for the editor is necessary to determine for example if we should use sharedMaterial or just material
	public void SetOutfit(bool editor){
		if(outfit == null)
			return;
		
		Material[] currentMaterials = editor ? character.sharedMaterials : character.materials;
					
		currentMaterials[rendererPantsIndex] = outfit.pants;
		currentMaterials[rendererShirtIndex] = outfit.shirt;
		currentMaterials[rendererSkinIndex] = outfit.skin;
		currentMaterials[rendererShoesIndex] = outfit.shoes;
		
		if(editor){
			character.sharedMaterials = currentMaterials;
			racket.sharedMaterial = outfit.racket;
			
			for(int i = 0; i < hair.Length; i++){
				hair[i].GetComponent<Renderer>().sharedMaterial = outfit.hair;
			}
		}
		else{
			character.materials = currentMaterials;
			racket.material = outfit.racket;
			
			for(int i = 0; i < hair.Length; i++){
				hair[i].GetComponent<Renderer>().material = outfit.hair;
			}
		}
		
		for(int i = 0; i < hair.Length; i++){
			hair[i].SetActive(outfit.hairType == i);
		}
		
		skirt.SetActive(outfit.female);
		
		for(int i = 0; i < hatRenderers.Length; i++){
			if(i == outfit.hatType){
				if(editor){
					hatRenderers[i].sharedMaterial = outfit.hatMat;
				}
				else{
					hatRenderers[i].material = outfit.hatMat;
				}
				
				hats[i].SetActive(true);
				
				if(outfit.female && !editor)
					hats[i].transform.Translate(Vector3.forward * 0.06f);
			}
			else{
				hats[i].SetActive(false);
			}
		}
		
		glasses.SetActive(outfit.glasses);
	}
	
	//if we add a new outfit to the outfit field, immediately try to update the character
	void OnValidate(){
		if(outfit == null)
			return;
		
		SetOutfit(true);
	}
}
