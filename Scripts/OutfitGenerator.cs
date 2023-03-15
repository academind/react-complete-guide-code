using System.Collections;
using System.Collections.Generic;
using UnityEngine;

#if UNITY_EDITOR
using UnityEditor;
#endif

public class OutfitGenerator : MonoBehaviour {
	
	#if UNITY_EDITOR
	public string path;
	[Space(10)]
	
	public ModifyOutfit display;
	public int index;
	public bool isFemale;
	public bool playerCharacter;
	
	public Material[] clothes;
	public Material[] skin;
	public Material[] shoes;
	public Material[] racket;
	public Material[] hair;
    
	public void GenerateNew(){
		Outfit newOutfit = ScriptableObject.CreateInstance<Outfit>();
		
		newOutfit.hatType = Random.Range(0, 5);
		newOutfit.glasses = Random.Range(0, 4) == 0;
		
		bool female = Random.Range(0, 2) == 0 || isFemale;
		newOutfit.female = female;
		
		newOutfit.hairType = female ? Random.Range(0, 2) : 2;
		
		newOutfit.skin = skin[Random.Range(0, skin.Length)];
		newOutfit.hatMat = clothes[Random.Range(0, clothes.Length)];
		newOutfit.shirt = clothes[Random.Range(0, clothes.Length)];
		newOutfit.pants = clothes[Random.Range(0, clothes.Length)];
		newOutfit.shoes = shoes[Random.Range(0, shoes.Length)];
		newOutfit.racket = racket[Random.Range(0, racket.Length)];
		newOutfit.hair = hair[Random.Range(0, hair.Length)];
		
		string filename = !playerCharacter ? path + "Outfit_" + index + ".asset" : path + "Player_" + index + ".asset";
		AssetDatabase.CreateAsset(newOutfit, filename);
        AssetDatabase.SaveAssets();

        EditorUtility.FocusProjectWindow();
		
		display.outfit = newOutfit;
		display.SetOutfit(true);
		
		index++;
	}
	
	#endif
}